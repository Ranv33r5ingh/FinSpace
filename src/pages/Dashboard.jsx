import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrendChart from '../components/charts/BalanceTrendChart';
import SpendingPieChart from '../components/charts/SpendingPieChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-5">
      {/* Summary cards */}
      <SummaryCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <BalanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <SpendingPieChart />
        </div>
      </div>

      {/* Recent transactions */}
      <RecentTransactions />
    </div>
  );
}
