export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#F1F5F9] py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌾</span>
              <span className="font-bold text-[#1E293B]">AgriSmart</span>
            </div>
            <p className="text-[#64748B] text-sm">
              Fair prices for your harvest, food security for the nation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#1E293B] mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-[#64748B] hover:text-[#00A86B]">About Us</a></li>
              <li><a href="/contact" className="text-[#64748B] hover:text-[#00A86B]">Contact</a></li>
              <li><a href="/faq" className="text-[#64748B] hover:text-[#00A86B]">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#1E293B] mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-[#64748B] hover:text-[#00A86B]">Privacy Policy</a></li>
              <li><a href="/terms" className="text-[#64748B] hover:text-[#00A86B]">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#1E293B] mb-3">Contact</h4>
            <p className="text-[#64748B] text-sm">Email: info@agrismart.lk</p>
            <p className="text-[#64748B] text-sm">Phone: 0112 345 678</p>
          </div>
        </div>
        
        <div className="border-t border-[#F1F5F9] mt-8 pt-8 text-center text-[#64748B] text-sm">
          © 2024 AgriSmart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}