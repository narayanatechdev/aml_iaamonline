import { ContactForm } from './ContactForm';

export function ContactSection() {
  return (
    <section id="contact" className="font-hub-body bg-[#F6F8FC]">
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <h2 className="font-hub-display font-bold text-[28px] text-[#0B1F4D]">Contact Us</h2>
        <div className="w-14 h-1 rounded-full bg-[#10B981] mt-2 mb-2" />
        <p className="text-[15px] text-[#5a6a8a] mb-8">We are here to help</p>

        <div className="grid lg:grid-cols-[1fr_1.3fr_1fr] gap-6 items-start">
          <div className="rounded-[10px] border border-[#DCE3F0] bg-white p-6">
            <p className="text-[14px] text-[#2B3853] leading-relaxed mb-4">
              Question about a submission, a subscription, a partnership or your membership? Write to us and the
              right team will reply within a few working days.
            </p>
            <dl className="space-y-3 text-[13.5px]">
              <div>
                <dt className="font-semibold text-[#0B1F4D]">Email</dt>
                <dd><a href="mailto:publications@iaamonline.org" className="text-[var(--brand)] hover:underline">publications@iaamonline.org</a></dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0B1F4D]">Phone</dt>
                <dd className="text-[#2B3853]">(+46) 1313-2424</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0B1F4D]">Office hours</dt>
                <dd className="text-[#2B3853]">Monday to Friday, 9:00–17:30 CET</dd>
              </div>
            </dl>
          </div>

          <ContactForm />

          <div className="rounded-[10px] border border-[#DCE3F0] bg-white p-6">
            <p className="font-hub-display font-bold text-[15px] text-[#0B1F4D] mb-3">Our office</p>
            <p className="text-[13.5px] text-[#2B3853] leading-relaxed mb-4">
              International Association of Advanced Materials
              <br />
              IAAM Publications
              <br />
              Gammalkilsvägen 18, Ulrika 590 53, Sweden
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Gammalkilsv%C3%A4gen+18%2C+Ulrika+590+53%2C+Sweden"
              className="text-[13px] font-semibold text-[var(--brand)] hover:underline"
            >
              View on Google Maps →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
