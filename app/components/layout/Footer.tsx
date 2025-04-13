export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="/about" className="text-gray-500 hover:text-gray-900">About</a></li>
              <li><a href="/careers" className="text-gray-500 hover:text-gray-900">Careers</a></li>
              <li><a href="/contact" className="text-gray-500 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="/blog" className="text-gray-500 hover:text-gray-900">Blog</a></li>
              <li><a href="/guides" className="text-gray-500 hover:text-gray-900">Guides</a></li>
              <li><a href="/help" className="text-gray-500 hover:text-gray-900">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="/privacy" className="text-gray-500 hover:text-gray-900">Privacy</a></li>
              <li><a href="/terms" className="text-gray-500 hover:text-gray-900">Terms</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Social</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="https://twitter.com" className="text-gray-500 hover:text-gray-900">Twitter</a></li>
              <li><a href="https://linkedin.com" className="text-gray-500 hover:text-gray-900">LinkedIn</a></li>
              <li><a href="https://facebook.com" className="text-gray-500 hover:text-gray-900">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">&copy; 2024 Real Estate AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}