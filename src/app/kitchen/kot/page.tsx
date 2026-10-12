import KotDashboard from '@/components/kot-dashboard';
import Link from 'next/link';
export default function KitchenPage(){return <><header className="topbar"><Link href="/" style={{fontWeight:800,textDecoration:'none'}}>🥐 Crumb & Co.</Link><Link href="/menu">Public menu</Link></header><KotDashboard/></>}
