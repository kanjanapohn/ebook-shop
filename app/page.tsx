import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0;

async function getBooks() {
  const { data: books, error } = await supabase.from('books').select('*');
  if (error) console.error('Error fetching books:', error);
  return books || [];
}

export default async function Home() {
  const books = await getBooks();

  return (
    <main className="min-h-screen p-6 md:p-10 bg-slate-50 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* ส่วน Header ของร้าน */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              E-Books Store
            </h1>
          </div>
          
          {/* ปุ่มติดตามคำสั่งซื้อ */}
          <Link href="/track" className="text-sm text-slate-600 hover:text-indigo-600 font-semibold mt-4 md:mt-0 flex items-center gap-2 bg-slate-50 hover:bg-indigo-50 px-5 py-2.5 rounded-full border border-slate-200 transition-all duration-200 shadow-sm hover:shadow cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            ติดตามคำสั่งซื้อ
          </Link>
        </div>

        {/* ส่วนแสดงรายการหนังสือ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group flex flex-col">
              
              {/* รูปภาพและป้าย Badge */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 shadow-sm z-10 flex items-center gap-1.5 border border-white/50">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                  E-Book
                </div>
                <img 
                  src={book.cover_image} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* รายละเอียดหนังสือ */}
              <div className="p-6 flex flex-col flex-grow">
                {/* ดาวรีวิวจำลอง */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-amber-400 flex gap-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    ))}
                  </span>
                  <span className="text-xs text-slate-500 font-medium ml-1">5.0 (ยอดเยี่ยม)</span>
                </div>

                <h2 className="text-xl font-bold mb-2 text-slate-800 line-clamp-2 leading-snug">{book.title}</h2>
                <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">{book.description}</p>
                
                {/* ราคาและปุ่มสั่งซื้อ */}
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold mb-0.5 uppercase tracking-wider">ราคาพิเศษ</p>
                    <p className="text-2xl font-black text-indigo-600">฿{book.price}</p>
                  </div>
                  <Link 
                    href={`/book/${book.id}`}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    สั่งซื้อ
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}