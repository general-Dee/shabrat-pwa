import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      event_type,
      url,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      session_id,
    } = body;

    // Get user agent from headers
    const userAgent = req.headers.get('user-agent') || '';

    const { error } = await supabase.from('traffic_events').insert({
      event_type,
      url,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      user_agent: userAgent,
      session_id,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Traffic tracking error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}