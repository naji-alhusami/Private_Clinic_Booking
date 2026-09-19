import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { PatientsList } from "@/components/dashboard/patients/patients-list";
import { getPatients } from "@/lib/data/getPatients";

export default async function PatientsPage() {
  const patients = await getPatients();

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <DashboardPageHeader
        eyebrow="Patient records"
        title="Patients"
        description="Browse the clinic’s patient directory and view individual patient records."
      />

      <PatientsList patients={patients} today={today} />
    </>
  );
}
