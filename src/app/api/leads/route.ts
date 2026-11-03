import { NextResponse } from 'next/server';
import { Lead } from '@/types/landing';

export const dynamic = 'force-dynamic';

const DEMO_LEADS: Lead[] = [
  {
    id: 'lead-101',
    customerName: 'তানভীর আহমেদ',
    phone: '01712-345678',
    address: 'মিরপুর ১০, ঢাকা',
    cityZone: 'dhaka',
    selectedPackage: {
      id: 'combo-special',
      name: 'Ilish Achar Combo Pack (3 Items)',
      banglaName: 'স্পেশাল ৩-ইন-১ আচার কম্বো (মোট ৪০০ গ্রাম)',
      price: 799,
    },
    quantity: 1,
    status: 'abandoned',
    notes: 'অর্ডার ফর্মে নাম্বার দেওয়ার পর ড্রপ করেছেন। কল করা দরকার।',
    callCount: 0,
    source: 'checkout_form',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'lead-102',
    customerName: 'সুমাইয়া আক্তার',
    phone: '01898-765432',
    address: 'জিইসি মোড়, চট্টগ্রাম',
    cityZone: 'outside',
    selectedPackage: {
      id: 'combo-special',
      name: 'Ilish Achar Combo Pack (3 Items)',
      banglaName: 'স্পেশাল ৩-ইন-১ আচার কম্বো (মোট ৪০০ গ্রাম)',
      price: 799,
    },
    quantity: 2,
    status: 'contacted',
    notes: 'কল করা হয়েছিল, বিকেলে কনফার্ম করবেন জানিয়েছেন।',
    callCount: 1,
    lastContactedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    source: 'checkout_form',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'lead-103',
    customerName: 'মোঃ কামরুল হাসান',
    phone: '01955-443322',
    address: 'উত্তরা সেক্টর ৭, ঢাকা',
    cityZone: 'dhaka',
    selectedPackage: {
      id: 'combo-special',
      name: 'Ilish Achar Combo Pack (3 Items)',
      banglaName: 'স্পেশাল ৩-ইন-১ আচার কম্বো (মোট ৪০০ গ্রাম)',
      price: 799,
    },
    quantity: 1,
    status: 'abandoned',
    notes: 'ফর্ম ফিলআপ শুরু করেছিলেন। এখনও অর্ডার করেননি।',
    callCount: 0,
    source: 'checkout_form',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'lead-104',
    customerName: 'ফারহানা ইসলাম',
    phone: '01611-223344',
    address: 'উপশহর, সিলেট সদর',
    cityZone: 'outside',
    selectedPackage: {
      id: 'combo-special',
      name: 'Ilish Achar Combo Pack (3 Items)',
      banglaName: 'স্পেশাল ৩-ইন-১ আচার কম্বো (মোট ৪০০ গ্রাম)',
      price: 799,
    },
    quantity: 1,
    status: 'converted',
    notes: 'কল করার পর গ্রাহক অর্ডার নিশ্চিত করেছেন।',
    callCount: 2,
    lastContactedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    source: 'checkout_form',
    createdAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: 'lead-105',
    customerName: 'আব্দুল কাদের',
    phone: '01700-112233',
    address: 'ধানমন্ডি ২৭, ঢাকা',
    cityZone: 'dhaka',
    selectedPackage: {
      id: 'combo-special',
      name: 'Ilish Achar Combo Pack (3 Items)',
      banglaName: 'স্পেশাল ৩-ইন-১ আচার কম্বো (মোট ৪০০ গ্রাম)',
      price: 799,
    },
    quantity: 1,
    status: 'contacted',
    notes: 'ডেলিভারি চার্জ ফ্রি কি না জানতে চেয়েছিলেন। নিশ্চিত করা হয়েছে।',
    callCount: 1,
    lastContactedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    source: 'checkout_form',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
  },
];

export async function GET() {
  // Returns demo list as requested
  return NextResponse.json({ success: true, leads: DEMO_LEADS, isDemo: true });
}

export async function POST() {
  // Lead capture is disabled (not functional yet, demo mode only)
  return NextResponse.json({
    success: true,
    message: 'Lead capture is currently paused in demo mode.',
  });
}
