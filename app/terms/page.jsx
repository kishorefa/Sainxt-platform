import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: June 18, 2025</p>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to our platform. These Terms of Service ("Terms") govern your access to and use of our website and services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="mb-4">
            You agree to use our services in compliance with all applicable laws and regulations. You are solely responsible for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="mb-4">
            All content and materials available on our platform, including but not limited to text, graphics, logos, and software, are the property of our company and are protected by intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will provide notice of any changes by updating the "Last updated" date at the top of this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@example.com.
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link href="/auth/register">
            Back to Registration
          </Link>
        </Button>
      </div>
    </div>
  )
}
