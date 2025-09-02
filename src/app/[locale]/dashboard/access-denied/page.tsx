'use client';

import { useTranslations } from 'next-intl';
import NoPermission from '@/components/auth/NoPermission';

export default function AccessDeniedPage() {
  const t = useTranslations('Permissions');
  
  return (
    <div className="min-h-screen bg-gradient-to-br  dark:from-slate-900 dark:to-slate-800">
      <NoPermission 
        title={t('access_denied')}
        description={t('no_permission_description')}
        showBackButton={true}
        showHomeButton={true}
      />
    </div>
  );
} 