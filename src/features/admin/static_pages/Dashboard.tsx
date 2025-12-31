import KpisRow from "./KpisRow";
import Schedule from "./Schedule";
import VacanciesSection from "./VacanciesSection";

export default function DashboardPage() {
  return (
    <>
      <KpisRow />

      <div className="grid grid-cols-12 gap-6 mt-6">
        <section className="col-span-12 lg:col-span-7">
          <VacanciesSection height={500} />
        </section>

        <aside className="col-span-12 lg:col-span-5">
          <Schedule height={500} />
        </aside>
      </div>
    </>
  );
}