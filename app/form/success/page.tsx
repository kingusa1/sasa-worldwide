/**
 * Payment Success Page
 * Shown after successful Stripe checkout
 */

export const dynamic = 'force-dynamic';

export default function FormSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-2">
            📧 <strong>Check your email</strong>
          </p>
          <p className="text-sm text-gray-700">
            Your voucher code and receipt have been sent to your email address.
            Please check your inbox (and spam folder).
          </p>
        </div>

        {/* What's Next */}
        <div className="text-left mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">What happens next?</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>You'll receive a confirmation email with your voucher code</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Follow the instructions in the email to redeem your voucher</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>If you have any questions, contact your sales representative</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600">
            Need help? Contact us at{' '}
            <a href="mailto:support@sasa-worldwide.com" className="text-navy hover:underline">
              support@sasa-worldwide.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
