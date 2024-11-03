import ContactForm from "@/components/Contact/ContactForm";
import Footer from "@/components/Home/Footer";

export const metadata = {
  title: "Contact - Venkatesh madari",
  description:
    "Get in touch with us for any inquiries, support, or feedback. We'd love to hear from you!",
};

export default function page() {
  return (
    <>
      <ContactForm />
    </>
  );
}
