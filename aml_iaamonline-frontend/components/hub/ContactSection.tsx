import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from './ContactForm';

const OFFICE_QUERY = 'Gammalkilsvägen 18, 590 53 Ulrika, Sweden';

const DETAILS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'publications@iaamonline.org',
    href: 'mailto:publications@iaamonline.org',
  },
  { icon: Phone, label: 'Phone', value: '(+46) 1313-2424', href: 'tel:+4613132424' },
  { icon: Clock, label: 'Office hours', value: 'Monday to Friday, 9:00–17:30 CET' },
];

export function ContactSection() {
  return (
    <section id="contact" className="font-hub-body bg-[#F6F8FC]">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-9">
          <div>
            <p className="flex items-center gap-3 text-[12px] font-bold tracking-[0.18em] uppercase text-[#5a6a8a] mb-3">
              <span className="w-7 h-[3px] rounded-full bg-[var(--brand)]" />
              Get in touch
            </p>
            <h2 className="font-hub-display font-bold text-[38px] leading-[1.05] text-[#0B1F4D] mb-2">
              Contact Us
            </h2>
            <p className="text-[15px] text-[#5a6a8a]">
              We are here to help. Reach out to us for any questions, collaborations, or support.
            </p>
          </div>

          <p
            aria-hidden="true"
            className="hidden lg:block text-right text-[11.5px] font-medium tracking-[0.2em] uppercase text-[#A9B6D6] leading-[1.9] pt-1"
          >
            <span className="block w-10 h-px bg-[#C5CEE3] ml-auto mb-3" />
            Advancing materials
            <br />
            for a brighter tomorrow
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-6 items-start">
          <div className="rounded-2xl border border-[#DCE3F0] bg-white p-7">
            <h3 className="font-hub-display font-bold text-[21px] text-[#0B1F4D] mb-3">Contact Information</h3>
            <p className="text-[14px] text-[#5a6a8a] leading-relaxed mb-6">
              Questions about a submission, a subscription, a partnership or your membership? Write to us and the
              right team will reply within a few working days.
            </p>

            <dl className="space-y-5">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex items-start gap-3.5">
                  <span className="w-11 h-11 rounded-full bg-[#EAF1FD] text-[var(--brand)] flex items-center justify-center flex-shrink-0">
                    <d.icon className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <dt className="text-[14px] font-bold text-[#0B1F4D]">{d.label}</dt>
                    <dd className="text-[14px] text-[#2B3853] mt-0.5">
                      {d.href ? (
                        <a href={d.href} className="text-[var(--brand)] hover:underline break-all">
                          {d.value}
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6 pt-6 border-t border-[#E4EBF7]">
              <div className="flex items-start gap-3.5">
                <span className="w-11 h-11 rounded-full bg-[#EAF1FD] text-[var(--brand)] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-[14px] font-bold text-[#0B1F4D]">Our Office</p>
                  <p className="text-[14px] text-[#2B3853] leading-relaxed mt-0.5">
                    International Association of Advanced Materials
                    <br />
                    IAAM Publications
                    <br />
                    Gammalkilsvägen 18, Ulrika 590 53, Sweden
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_QUERY)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-[13.5px] font-semibold text-[var(--brand)] hover:underline"
                  >
                    View on Google Maps <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Loaded lazily so Google is only contacted if a reader scrolls here. */}
              <iframe
                title="Map showing the IAAM Publications office in Ulrika, Sweden"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(OFFICE_QUERY)}&z=12&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[230px] mt-5 rounded-xl border border-[#DCE3F0]"
              />
            </div>
          </div>

          <ContactForm />
        </div>

        <div
          aria-hidden="true"
          className="hidden sm:flex items-center justify-between gap-6 mt-12 text-[11.5px] font-medium tracking-[0.2em] uppercase text-[#A9B6D6]"
        >
          <span>Science · Collaboration · Impact</span>
          <span className="flex items-center gap-4">
            <span className="w-10 h-px bg-[#C5CEE3]" />
            IAAM
          </span>
        </div>
      </div>
    </section>
  );
}
