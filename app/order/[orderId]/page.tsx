"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderStatus() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true); // เปลี่ยนให้เริ่มด้วย true
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null); // เพิ่ม state เก็บข้อผิดพลาด

  useEffect(() => {
    async function fetchOrderAndBook() {
      try {
        // ดึงข้อมูลคำสั่งซื้อ
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError || !orderData) {
          setError('ไม่พบคำสั่งซื้อนี้ กรุณาตรวจสอบรหัสอีกครั้ง');
          setLoading(false);
          return;
        }

        setOrder(orderData);

        // ดึงข้อมูลหนังสือที่เชื่อมโยงกับคำสั่งซื้อ
        const { data: bookData } = await supabase
          .from('books')
          .select('*')
          .eq('id', orderData.book_id)
          .single();
          
        setBook(bookData);
        
        if (orderData.status === 'PAID') {
          setEmailSent(true);
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false); // โหลดเสร็จแล้ว (ไม่ว่าจะเจอหรือไม่เจอข้อมูล)
      }
    }
    
    if (orderId) {
      fetchOrderAndBook();
    }
  }, [orderId]);

  const handleMockPayment = async () => {
    setLoading(true);
    const { error } = await supabase.from('orders').update({ status: 'PAID' }).eq('id', orderId);
    
    if (!error) {
      setOrder({ ...order, status: 'PAID' });
      setEmailSent(true); 
    } else {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    }
    setLoading(false);
  };

  // 1. ถ้ากำลังโหลดข้อมูลอยู่
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">กำลังค้นหาข้อมูลคำสั่งซื้อ...</p>
        </div>
      </div>
    );
  }

  // 2. ถ้ามี Error (เช่น หาไม่เจอ)
  if (error || !order || !book) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center">
          <div className="inline-block bg-red-100 p-3 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">ค้นหาไม่สำเร็จ</h2>
          <p className="text-slate-500 mb-6">{error || 'ไม่พบข้อมูลคำสั่งซื้อ'}</p>
          <button 
            onClick={() => router.push('/track')}
            className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition font-medium"
          >
            ลองค้นหาใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // 3. ถ้าเจอข้อมูล (แสดงหน้าจอปกติ)
  return (
    <main className="min-h-screen p-6 md:p-10 bg-slate-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800 tracking-tight">สถานะคำสั่งซื้อ</h1>
        
        <div className="mb-6 space-y-3 text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-100">
          <p className="flex flex-col">
            <span className="text-xs text-slate-400 font-semibold uppercase mb-1">รหัสคำสั่งซื้อ</span>
            <span className="text-sm font-mono break-all">{order.id}</span>
          </p>
          <div className="h-px bg-slate-200 my-2"></div>
          <p><strong>หนังสือ:</strong> {book.title}</p>
          <p><strong>ผู้ซื้อ:</strong> {order.customer_name}</p>
          <p className="flex items-center gap-2 mt-2">
            <strong>สถานะ:</strong> 
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {order.status === 'PAID' ? 'ชำระเงินแล้ว' : 'รอชำระเงิน (PENDING)'}
            </span>
          </p>
        </div>

        {order.status === 'PENDING' && (
          <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 text-center flex flex-col items-center">
            <span className="inline-block bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full mb-4 tracking-wider">
              DEMO ONLY
            </span>
            
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mb-4">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DEMO_ONLY_MOCK_PAYMENT" 
                alt="Mock QR Code" 
                className="w-32 h-32 mx-auto"
              />
              <p className="text-xs text-slate-400 mt-2 font-mono">สแกนเพื่อจำลองชำระเงิน</p>
            </div>

            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              การชำระเงินนี้เป็นการจำลองสถานะคำสั่งซื้อเท่านั้น ห้ามรับเงินจริง
            </p>
            <button 
              onClick={handleMockPayment} disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all font-bold shadow-md hover:shadow-lg"
            >
              {loading ? 'กำลังประมวลผล...' : 'จำลองชำระเงินสำเร็จ'}
            </button>
          </div>
        )}

        {order.status === 'PAID' && emailSent && (
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-emerald-800 font-bold mb-2 text-lg">ชำระเงินสำเร็จ!</h3>
            <p className="text-sm text-emerald-700 mb-6 leading-relaxed">
              ระบบได้ส่งลิงก์ดาวน์โหลด E-book ไปที่อีเมล<br/>
              <strong className="block mt-1">{order.customer_email}</strong>
            </p>
            <Link href="/" className="inline-block bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-2.5 px-5 rounded-xl text-sm font-bold transition-all shadow-sm">
              กลับไปหน้าหลัก
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}