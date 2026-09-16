import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // ดึงข้อมูลหนังสือ 1 เล่มจาก Supabase
  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (!book) return <div className="p-8 text-center text-red-500 font-bold">ไม่พบหนังสือ</div>;

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-gray-100">
        <img 
          src={book.cover_image} 
          alt={book.title} 
          className="w-full h-64 object-cover rounded-lg mb-6 shadow-sm" 
        />
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{book.title}</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">{book.description}</p>
        <p className="text-2xl font-bold text-green-600 mb-8">{book.price} บาท</p>
        <Link 
          href={`/checkout/${book.id}`}
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          ดำเนินการสั่งซื้อ
        </Link>
      </div>
    </main>
  );
}