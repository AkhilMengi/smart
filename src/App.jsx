import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          
          <div className="bg-white rounded-2xl h-full border border-slate-200 p-6">
            <h1 className="text-2xl font-semibold text-slate-800">
              Dashboard Content
            </h1>
          </div>

        </main>
      </div>
    </div>
  );
}