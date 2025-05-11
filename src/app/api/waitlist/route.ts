import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    try {
      // Check if the waitlist table exists
      const { error: tableCheckError } = await supabase
        .from('waitlist')
        .select('email')
        .limit(1)
        .maybeSingle()

      // If the table doesn't exist, try to create it
      if (tableCheckError && tableCheckError.code === '42P01') { // PostgreSQL code for undefined_table
        console.log('Waitlist table does not exist, attempting to create it...')
        
        // Create the waitlist table directly using SQL
        const { error: createTableError } = await supabase.rpc(
          'execute_sql',
          {
            sql: `
              CREATE TABLE IF NOT EXISTS public.waitlist (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              );
              -- Add RLS policies
              ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
              -- Allow anon users to insert
              CREATE POLICY "Allow anonymous inserts to waitlist" ON public.waitlist
                FOR INSERT WITH CHECK (true);
              -- Allow authenticated users to select their own entries
              CREATE POLICY "Allow authenticated users to select waitlist" ON public.waitlist
                FOR SELECT USING (auth.role() = 'authenticated');
            `
          }
        )
        
        if (createTableError) {
          console.error('Failed to create waitlist table:', createTableError)
          // Try a simpler approach if the execute_sql RPC function isn't available
          try {
            // Connect directly to the database with service role to create the table
            const adminClient = createServerClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              {
                cookies: {
                  get(name: string) {
                    return cookieStore.get(name)?.value
                  },
                },
                auth: {
                  autoRefreshToken: false,
                  persistSession: false
                }
              }
            )
            
            // Try a simpler table creation without RLS
            const { error: simpleCreateError } = await adminClient.rpc(
              'execute_sql',
              {
                sql: `
                  CREATE TABLE IF NOT EXISTS public.waitlist (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    email TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                  );
                `
              }
            )
            
            if (simpleCreateError) {
              console.error('Failed simple table creation:', simpleCreateError)
              return NextResponse.json(
                { error: 'Database setup error. Please contact support.' },
                { status: 500 }
              )
            }
          } catch (adminError) {
            console.error('Admin client error:', adminError)
            return NextResponse.json(
              { error: 'Database setup error. Please contact support.' },
              { status: 500 }
            )
          }
        }
      }

      // Insert the email into the waitlist table
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([{ email }])

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        return NextResponse.json(
          { error: `Failed to join waitlist: ${insertError.message}` },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { message: 'Successfully joined waitlist' },
        { status: 200 }
      )
    } catch (dbError) {
      console.error('Database operation error:', dbError)
      return NextResponse.json(
        { error: 'Database operation failed. Please try again later.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}