"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';

export default function Checkout() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [book, setBook] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      const { data } = await supabase.from('books').select('*').eq('id', id).single();
      setBook(data);
    }
    fetchBook();
  }, [id]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // สร้างคำสั่งซื้อและบันทึกสถานะเริ่มต้นเป็น PENDING
    const { data, error } = await supabase
      .from('orders')
      .insert([{ book_id: id, customer_name: name, customer_email: email, status: 'PENDING' }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } else if (data) {
      // ไปยังหน้าติดตามผลคำสั่งซื้อ (เราจะสร้างหน้านี้ในขั้นตอนถัดไป)
      router.push(`/order/${data.id}`);
    }
  };

  if (!book) return <div className="min-h-screen flex justify-center items-center">กำลังโหลดข้อมูล...</div>;

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">สรุปรายการสั่งซื้อ</h1>
        
        <div className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50">
          <h2 className="font-semibold text-gray-800 line-clamp-2">{book.title}</h2>
          <p className="text-green-600 font-bold mt-2">ยอดชำระ: {book.price} บาท</p>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">ชื่อ-นามสกุล</label>
            <input 
              type="text" required 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">อีเมล</label>
            <input 
              type="email" required 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-bold mt-4"
          >
            {loading ? 'กำลังดำเนินการ...' : 'ยืนยันคำสั่งซื้อ'}
          </button>
        </form>
      </div>
    </main>
  );
}