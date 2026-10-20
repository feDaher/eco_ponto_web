import Sidebar from './components/sidebar/sidebar';
import Header from './components/header/header';
import Article from './components/article/article';
import RecordReceipt from './components/record_receipt/record_receipt';
import PointData from './components/collection_point_data/point_data';
import Footer from './components/footer/footer';

export default function HomePage() {
  return (
      <div className="fixed inset-0 z-50 flex w-screen h-screen overflow-hidden bg-[#f4f6f8] text-slate-800 font-sans selection:bg-emerald-100">
          <aside className="w-64 bg-[#eff4ff] border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-full overflow-hidden">
            <Sidebar />
          </aside>
          <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
            <div className="shrink-0 z-10">
              <Header />
            </div>
          <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-[1400px] w-full mx-auto bg-white">
            <Article />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RecordReceipt />
              </div>
              <PointData />
            </div>
            <Footer/>
          </main>
      </div>
    </div>
  );
}