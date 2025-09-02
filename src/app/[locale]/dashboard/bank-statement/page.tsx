"use client";
import React from "react";
import { UploadBankStatement } from "./upload-file";
import { useBankStatementStore } from "@/stores/bank-statement.store";
import { toast } from "sonner";
import BankStatementLoader from "./loading";
import NoTransactionsFound from "./no-transactions";
import PDFRequirments from "./pdf-requirments";
import BankStatementEditor from "./manage-transactions";
import { BankStatmentType } from "@/types/bank-statement.type";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useRouter } from "next/navigation";

const BankingStatment = () => {
  const router = useRouter();
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const {
    transactions,
    isLoading,
    setIsLoading,
    genMockTransactions,
    setTransactions,
    uploadedFile,
    setUploadedFile,
    sendRecordsGeneration,
  } = useBankStatementStore();

  const arabicTypeMap: Record<string, "revenue" | "expense"> = {
    ايراد: "revenue",
    إيراد: "revenue",
    إيرادات: "revenue",
    مصروفات: "expense",
    مصروف: "expense",
    نفقات: "expense",
  };

  function mergeMultilineRecords(rawList: string[]): string[] {
    const merged: string[] = [];
    let buffer = "";

    for (const line of rawList) {
      const hasDate = /^\d{2}\/\d{2}\/\d{4},/.test(line); // starts with date
      const isLikelyFull = line.split(",").length >= 6;

      if (hasDate && buffer) {
        merged.push(buffer.trim());
        buffer = "";
      }

      buffer += (buffer ? " " : "") + line;

      if (isLikelyFull) {
        merged.push(buffer.trim());
        buffer = "";
      }
    }

    if (buffer) {
      merged.push(buffer.trim());
    }

    return merged;
  }

  function normalizeType(input: string): "revenue" | "expense" {
    const lower = input.trim().toLowerCase();
    return (
      arabicTypeMap[lower] ||
      (lower === "revenue" || lower === "expense" ? lower : "expense")
    );
  }

  function parseRecords(rawList: string[]): BankStatmentType[] {
    const lines = mergeMultilineRecords(rawList);

    return lines.reduce<BankStatmentType[]>((acc, record) => {
      try {
        const parts = record.split(",");

        if (parts.length < 6) return acc;

        const dateStr = parts[0]?.trim();
        const amountStr = parts[1]?.trim();
        const description = parts[2]?.trim();
        const _remove = parts[3]; // ignored
        const typeRaw = parts[4]?.trim();
        const category = parts[5]?.trim() || "uncategorized";
        const subcategory = parts[6]?.trim() || "general";

        const date = new Date(dateStr);
        const amount = parseFloat(amountStr);

        if (isNaN(date.getTime()) || isNaN(amount)) return acc;

        const type = normalizeType(typeRaw);

        acc.push({
          id: uuidv4(),
          date,
          amount,
          description,
          type,
          category,
          subcategory,
        });
      } catch (err) {
        console.log("Error parsing record:", record, err);
      }

      return acc;
    }, []);
  }

  const onFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setUploadedFile(file);
      const formData = new FormData();
      formData.append("file", file);
      console.log(process.env.NEXT_PUBLIC_PDF_PROCCESSING_URL);
      if (
        process.env.NEXT_PUBLIC_PDF_PROCCESSING_URL == null ||
        process.env.NEXT_PUBLIC_PDF_PROCCESSING_URL == undefined
      ) {
        setIsLoading(false);
        return genMockTransactions();
      }

      await axios
        .post(process.env.NEXT_PUBLIC_PDF_PROCCESSING_URL!, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // console.log(res.data);
          const parsedRecords = parseRecords(res.data);
          setTransactions(parsedRecords);
          // console.log(parsedRecords);
          // console.log(parsedRecords);
        })
        .catch((err) => {
          console.log("Error:", err);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      toast.error("Error uploading file");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneraeteRecords = async (data: BankStatmentType[]) => {
    if (!session?.accessToken || !organizationId) {
      toast.error("Error generating records");
      return;
    }
    try {
      setIsLoading(true);
      await sendRecordsGeneration({
        accessToken: session?.accessToken,
        organizationId: organizationId,
        records: data,
      })
        .then((res) => {
          if (res.isOk) {
            toast.success("Records generated successfully");
            router.push("/dashboard");
            return;
          }
          if (res.error) {
            toast.error("Error generating records");
            router.push("/dashboard");
            return;
          }
          toast.error("Error generating records data");
          router.push("/dashboard");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error generating records");
          router.push("/dashboard");
        })
        .finally(() => {
          setIsLoading(false);
          router.push("/dashboard");
        });
    } catch (error) {
      toast.error("Error generating records");
      console.error(error);
    }
  };

  if (isLoading) {
    return <BankStatementLoader />;
  }

  if (!uploadedFile || uploadedFile == null) {
    return (
      <div className="flex justify-center items-center flex-col gap-5">
        <UploadBankStatement onUploadComplete={onFileUpload} />
        <PDFRequirments />
      </div>
    );
  }

  if (transactions.length === 0 || !transactions) {
    return <NoTransactionsFound />;
  }

  return (
    <div>
      <BankStatementEditor
        transactions={transactions}
        onSave={handleGeneraeteRecords}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BankingStatment;
