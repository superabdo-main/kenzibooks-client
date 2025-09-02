"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn-ui/button";
import { Form } from "@/components/shadcn-ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import {
  EmployeeFormValues,
  employeeFormSchema,
  defaultFormValues,
} from "./schema";
import { Employee } from "@/types/employee.type";
import { User, CreditCard, DollarSign, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEmployeesStore } from "@/stores/employees.store";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";

// Import tab components
import { EmployeeDetailsTab } from "./employee-details-tab";
import { EmployeePayTypeTab } from "./employee-paytype-tab";
import { EmployeePayTypesTab } from "./employee-additionaltypes-tab";

interface EmployeeFormProps {
  defaultValues?: EmployeeFormValues;
  employeeId?: string;
  isEditing?: boolean;
}

const EmployeeForm = ({
  defaultValues = defaultFormValues,
  employeeId,
  isEditing = false,
}: EmployeeFormProps) => {
  const t = useTranslations("Employee.form");
  const router = useRouter();
  const { createEmployee, updateEmployee, isLoading } = useEmployeesStore();
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { toast } = useToast();

  // Initialize the form with default or provided values
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      ...defaultValues,
      organizationId: organizationId || "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: EmployeeFormValues) => {
    if (!session?.accessToken || !organizationId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Authentication required",
      });
      return;
    }

    try {
      if (isEditing && employeeId) {
        // Update existing employee
        const updatedEmployee: Employee = {
          id: employeeId,
          payScheduleId: data.paySchedule.payFrequency,
          ...data,
        };

        const response = await updateEmployee({
          id: employeeId,
          employee: updatedEmployee,
          accessToken: session.accessToken,
        });

        if (response.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error,
          });
        } else {
          toast({
            variant: "default",
            title: "Success",
            description: "Employee updated successfully",
          });
          router.push(`/dashboard/employees`);
        }
      } else {
        // Create new employee
        const newEmployee: Employee = data;

        const response = await createEmployee({
          employee: {
            ...newEmployee,
            payScheduleId: newEmployee.paySchedule.payFrequency,
          },
          accessToken: session.accessToken,
        });

          if (response.error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: response.error,
            });
          } else {
            toast({
              variant: "default",
              title: "Success",
              description: "Employee created successfully",
            });
            router.push(`/dashboard/employees`);
          }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isEditing ? t("title.edit") : t("title.create")}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("tabs.details")}
              </TabsTrigger>
              {/* <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t("tabs.payment")}
              </TabsTrigger> */}
              <TabsTrigger value="paytype" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t("tabs.payType")}
              </TabsTrigger>
              <TabsTrigger value="paytypes" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t("tabs.payTypes")}
              </TabsTrigger>
            </TabsList>

            {/* Employee Details Tab */}
            <TabsContent value="details">
              <EmployeeDetailsTab control={form.control} />
            </TabsContent>

            {/* Payment Methods Tab
            <TabsContent value="payment">
              <EmployeePaymentTab control={form.control} />
            </TabsContent> */}

            {/* Pay Type Tab */}
            <TabsContent value="paytype">
              <EmployeePayTypeTab control={form.control} />
            </TabsContent>

            {/* Pay Types Tab */}
            <TabsContent value="paytypes">
              <EmployeePayTypesTab control={form.control} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/employees`)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEditing ? (
                t("buttons.update")
              ) : (
                t("buttons.create")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmployeeForm;
