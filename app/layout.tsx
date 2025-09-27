import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import React from 'react'

export const metadata = {
  title: 'VietnamLLM',
  description: 'VietnamLLM Documentation'
}

const banner = <Banner storageKey="vietnamllm-banner">Welcome to VietnamLLM 🎉</Banner>

const navbar = (
  <Navbar
    logo={<b>VietnamLLM</b>}
    // ... Your additional navbar options
  />
)

const footer = <Footer>MIT {new Date().getFullYear()} © VietnamLLM.</Footer>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
        // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/VietnamLLM/vietnamllm.github.io/tree/main"
          footer={footer}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}