import KpisRow from "./KpisRow";
import Schedule from "./Schedule";
import VacanciesSection from "./VacanciesSection";
import Jobs from '@/features/job-management/components/GetJob'


export default function DashboardPage() {
  return (
    <>
      <KpisRow />

      <div className="grid grid-cols-12 gap-6 mt-6">
        <section className="col-span-12 lg:col-span-7">
          {/* <VacanciesSection height={636} /> */}
          <Jobs />
        </section>

        <aside className="col-span-12 lg:col-span-5">
          <Schedule height={636} />
        </aside>
      </div>
    </>
  );
}