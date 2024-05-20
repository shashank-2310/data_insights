import SalaryTable from "@/components/SalaryTable";

export default function Home() {
  return (
    <main className="flex-between min-h-screen flex-row p-2 md:p-4 lg:p-8 bg-gray-200">
      <SalaryTable />
    </main>
  );
}
