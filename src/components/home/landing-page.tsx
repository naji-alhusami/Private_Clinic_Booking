import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/home/section-heading";
import { Icon, type IconName } from "@/components/ui/icon";

const services: Array<{
  title: string;
  description: string;
  icon: IconName;
}> = [
  {
    title: "Neurological Consultation",
    description:
      "A detailed specialist review of your symptoms, medical history, and individual concerns.",
    icon: "user",
  },
  {
    title: "EEG",
    description:
      "Non-invasive recording of brain activity to support the evaluation of seizures and related symptoms.",
    icon: "wave",
  },
  {
    title: "EMG & Nerve Conduction",
    description:
      "Focused testing of nerve and muscle function for weakness, numbness, or unexplained discomfort.",
    icon: "nerve",
  },
  {
    title: "Headache & Migraine",
    description:
      "Structured assessment and an individualized care plan for recurring or complex headaches.",
    icon: "brain",
  },
  {
    title: "Epilepsy Care",
    description:
      "Thorough evaluation, treatment guidance, and considered long-term follow-up for epilepsy.",
    icon: "pulse",
  },
  {
    title: "Neuropathy Assessment",
    description:
      "Investigation of tingling, burning, numbness, and other signs of peripheral nerve conditions.",
    icon: "nerve",
  },
  {
    title: "Dizziness & Vertigo",
    description:
      "Careful assessment to clarify balance problems, dizziness, and vertigo-related symptoms.",
    icon: "ear",
  },
  {
    title: "Memory & Cognition",
    description:
      "Sensitive evaluation of memory changes, concentration difficulties, and cognitive concerns.",
    icon: "memory",
  },
  {
    title: "Movement Disorders",
    description:
      "Specialist consultation for tremor, stiffness, involuntary movement, and mobility changes.",
    icon: "movement",
  },
  {
    title: "Follow-up Appointments",
    description:
      "Continuity of care with clear reviews of progress, results, medication, and next steps.",
    icon: "calendar",
  },
];

const benefits: Array<{
  title: string;
  description: string;
  icon: IconName;
}> = [
  {
    title: "Personalized Care",
    description:
      "Every appointment is shaped around your symptoms, questions, and priorities.",
    icon: "user",
  },
  {
    title: "Calm Environment",
    description:
      "A quiet private setting designed to help you feel comfortable and heard.",
    icon: "heart",
  },
  {
    title: "Modern Diagnostics",
    description:
      "Evidence-led neurological assessment supported by contemporary diagnostic methods.",
    icon: "pulse",
  },
  {
    title: "Clear Communication",
    description:
      "Straightforward explanations help you understand your diagnosis and choices.",
    icon: "message",
  },
  {
    title: "Flexible Scheduling",
    description:
      "Private appointments planned with your time and individual needs in mind.",
    icon: "calendar",
  },
  {
    title: "Thoughtful Follow-up",
    description:
      "Ongoing care provides clarity, reassurance, and continuity beyond your first visit.",
    icon: "shield",
  },
];

const hours = [
  ["Monday", "08:30 – 17:00"],
  ["Tuesday", "08:30 – 17:00"],
  ["Wednesday", "08:30 – 16:00"],
  ["Thursday", "08:30 – 17:00"],
  ["Friday", "08:30 – 13:00"],
  ["Saturday", "Closed"],
  ["Sunday", "Closed"],
];

const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-950/15 outline-none transition-all hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 motion-reduce:transform-none";

const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2";

export function LandingPage() {
  return (
    <main>
      <section
        id="home"
        aria-labelledby="hero-heading"
        className="relative scroll-mt-24 overflow-hidden bg-[#f7faf9]"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute -left-32 top-16 size-80 rounded-full bg-teal-100/60 blur-3xl" />
          <div className="absolute -right-24 bottom-0 size-96 rounded-full bg-cyan-100/50 blur-3xl" />
          <div className="hero-grid absolute inset-0 opacity-35" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-4.75rem)] max-w-8xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-29 lg:py-16 xl:gap-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.17em] text-teal-800 shadow-sm backdrop-blur">
              <span className="size-1.5 rounded-full bg-teal-600" />
              Neurology Clinic
            </div>
            <h1
              id="hero-heading"
              className="mt-7 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
            >
              Expert neurological care for your health and peace of mind
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Comprehensive diagnosis, evaluation, and follow-up care for
              neurological conditions in a calm and patient-focused private
              practice.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book-appointment" className={primaryButton}>
                Book Appointment
                <Icon name="arrow" className="size-4" />
              </Link>
              <Link href="#services" className={secondaryButton}>
                Explore Services
              </Link>
            </div>
            <ul className="mt-9 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              {[
                "Private appointments",
                "Clear next steps",
                "Modern diagnostics",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-700">
                    <Icon name="check" className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:ml-auto">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[2.5rem] border border-teal-200/60" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-200 shadow-2xl shadow-slate-900/15">
              <Image
                src="/images/dr-adrian-keller.png"
                alt="Fictional neurologist Dr. Ahmad Hussami in a private clinic"
                fill
                priority
                sizes="(max-width: 1023px) 90vw, 42vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/55 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-lg backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
                <div>
                  <p className="font-semibold text-slate-950">Dr. Ahmad Hussami</p>
                  <p className="mt-1 text-sm text-slate-600">Specialist in Neurology</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-700 text-white">
                  <Icon name="brain" className="size-6" />
                </span>
              </div>
            </div>
            <div className="absolute -left-5 top-12 hidden rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <Icon name="sparkles" className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Thoughtful care</p>
                  <p className="mt-0.5 text-[0.7rem] text-slate-500">Centered around you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        aria-labelledby="services-heading"
        className="scroll-mt-24 bg-white py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Specialist care"
            title="Our Services"
            description="We provide modern neurological assessment and personalized care for a wide range of conditions."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
            {services.map((service, index) => (
              <article
                key={service.title}
                className={`group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/5 motion-reduce:transform-none ${
                  index === services.length - 1 ? "lg:col-span-3 xl:col-span-1" : ""
                }`}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-700 group-hover:text-white">
                  <Icon name={service.icon} className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.015em] text-slate-950">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        aria-labelledby="about-heading"
        className="scroll-mt-24 bg-slate-50 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-xl shadow-slate-900/10">
                <Image
                  src="/images/consultation-room.png"
                  alt="Warm, modern neurological consultation room at NeuroCare Private Clinic"
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative mx-4 -mt-10 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:ml-auto sm:mr-6 sm:max-w-sm">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-700 text-white">
                  <Icon name="shield" className="size-6" />
                </span>
                <div>
                  <p className="font-semibold text-slate-950">Care built on trust</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    Unhurried visits and clear guidance at every step.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <SectionHeading eyebrow="Care with purpose" title="About the Practice" />
              <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                NeuroCare Private Clinic is dedicated to providing attentive,
                personalized neurological care in a calm and professional
                environment. We combine clinical expertise with a patient-centered
                approach to ensure clarity, trust, and continuity of care.
              </p>
              <div className="mt-8 border-t border-slate-200 pt-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                  Meet the Doctor
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  Dr. Ahmad Hussami
                </h3>
                <p className="mt-1 text-sm font-medium text-teal-700">
                  Specialist in Neurology
                </p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Dr. Ahmad Hussami is a fictional specialist in neurology presented
                  for this demo project. The profile is included to simulate a
                  realistic private clinic website with a professional and
                  trustworthy presentation.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    "Personalized consultations",
                    "Modern diagnostic approach",
                    "Long-term follow-up care",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-5 text-slate-700">
                      <Icon name="check" className="mt-0.5 size-4 shrink-0 text-teal-700" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-teal-950 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The NeuroCare difference"
            title="Why Patients Choose Our Clinic"
            description="Clinical expertise matters. So does feeling listened to, informed, and supported throughout your care."
            align="center"
            tone="dark"
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="bg-teal-950 p-7 sm:p-8">
                <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-teal-300">
                  <Icon name={benefit.icon} className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{benefit.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-slate-300">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Designed for your comfort"
            title="Our Practice"
            description="A considered clinical environment where modern medical care feels calm, private, and personal."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">
            <figure className="group relative min-h-72 overflow-hidden rounded-3xl sm:col-span-2 lg:col-span-7 lg:row-span-2 lg:min-h-[36rem]">
              <Image
                src="/images/waiting-room.png"
                alt="Bright and welcoming reception area at NeuroCare Private Clinic"
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 p-6 text-sm font-medium text-white sm:p-8">
                A welcoming, private reception
              </figcaption>
            </figure>
            <figure className="group relative min-h-64 overflow-hidden rounded-3xl lg:col-span-5">
              <Image
                src="/images/consultation-room.png"
                alt="Private neurology consultation room with modern diagnostic equipment"
                fill
                sizes="(max-width: 1023px) 50vw, 42vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 p-6 text-sm font-medium text-white">
                Modern consultation spaces
              </figcaption>
            </figure>
            <figure className="group relative min-h-64 overflow-hidden rounded-3xl lg:col-span-5">
              <Image
                src="/images/neural-pathways.png"
                alt="Abstract medical visualization of interconnected neural pathways"
                fill
                sizes="(max-width: 1023px) 50vw, 42vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 p-6 text-sm font-medium text-white">
                Focused neurological expertise
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="book" aria-labelledby="book-heading" className="scroll-mt-24 bg-white px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-teal-700 px-6 py-14 sm:px-10 sm:py-16 lg:px-16">
          <div aria-hidden="true" className="absolute -right-20 -top-28 size-80 rounded-full border-[48px] border-white/5" />
          <div aria-hidden="true" className="absolute -bottom-28 left-1/3 size-64 rounded-full bg-teal-400/10 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100">Your next step</p>
              <h2 id="book-heading" className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                Book Your Appointment
              </h2>
              <p className="mt-4 text-base leading-7 text-teal-50/90 sm:text-lg">
                Schedule your visit quickly and easily. We are here to support you
                with professional neurological care.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/book-appointment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-900 shadow-md outline-none transition-all hover:-translate-y-0.5 hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-700 motion-reduce:transform-none">
                Book Appointment
                <Icon name="arrow" className="size-4" />
              </Link>
              <Link href="#contact" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-700">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Plan your visit"
            title="Contact & Opening Hours"
            description="Reach our private practice directly to arrange an appointment or ask a question about your visit."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-semibold text-slate-950">NeuroCare Private Clinic</h3>
              <address className="mt-7 space-y-5 not-italic">
                <div className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon name="map-pin" className="size-5" />
                  </span>
                  <p className="text-sm leading-6 text-slate-600">
                    Kassel-Straße 118<br />34119 Kassel<br />Germany
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon name="phone" className="size-5" />
                  </span>
                  <a href="tel:+495619876543" className="rounded text-sm font-medium text-slate-700 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">
                    +49 111 11111111
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon name="mail" className="size-5" />
                  </span>
                  <a href="mailto:info@neurocare-clinic.de" className="rounded text-sm font-medium text-slate-700 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">
                    info@neurocare-clinic.de
                  </a>
                </div>
              </address>

              <div className="map-pattern relative mt-8 flex min-h-52 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#eef4f2]">
                <div aria-hidden="true" className="absolute inset-0 opacity-70" />
                <div className="relative rounded-2xl border border-white bg-white/90 px-5 py-4 text-center shadow-lg backdrop-blur">
                  <span className="mx-auto grid size-10 place-items-center rounded-full bg-teal-700 text-white shadow-md">
                    <Icon name="map-pin" className="size-5" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-slate-900">Central Kassel</p>
                  <p className="mt-1 text-xs text-slate-500">Kassel-Straße 118</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon name="clock" className="size-5" />
                </span>
                <h3 className="text-xl font-semibold text-slate-950">Opening Hours</h3>
              </div>
              <dl className="mt-7 divide-y divide-slate-100">
                {hours.map(([day, time]) => (
                  <div key={day} className="flex items-center justify-between gap-6 py-3.5 text-sm">
                    <dt className="font-medium text-slate-700">{day}</dt>
                    <dd className={time === "Closed" ? "text-slate-400" : "text-slate-600"}>{time}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex gap-3 rounded-2xl bg-amber-50 p-4 text-amber-950">
                <Icon name="calendar" className="mt-0.5 size-5 shrink-0 text-amber-700" />
                <p className="text-sm leading-6">Appointments are available by prior booking only.</p>
              </div>
              <a href="tel:+495619876543" className={`${primaryButton} mt-7 w-full`}>
                Call to Arrange an Appointment
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
