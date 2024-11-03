"use client";
import { useState } from "react";
import Link from "next/link";
import { sora_font } from "../preloader/Preloader";
import { MdArrowOutward } from "react-icons/md";
import { FaLinkedinIn } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [buttonText, setButtonText] = useState("Send a message");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setButtonText("Sending...");

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          subject: formData.subject,
          user_name: formData.fullName,
          message: formData.message,
          user_email: formData.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(() => {
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        });
        setButtonText("Sent!");
        console.log("Hitting");

        setTimeout(() => setButtonText("Send a message"), 3000);
        toast.success("Message sent successfully");
      })
      .catch((error) => {
        console.error("Email send error:", error);
        setButtonText("Send a message");
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <footer
      className={` ${sora_font.className} bg-third rounded-3xl min-h-screen flex items-center mb-24 md:mb-0`}
    >
      <div className="container mx-auto px-4 pt-16 flex flex-col lg:flex-row gap-16">
        {/* Left Section */}
        <div className="flex-1 space-y-12">
          <div className="space-y-6">
            <p className="text-gradient capitalize"> let's connect </p>
            <h1 className="text-3xl md:text-5xl font-medium  leading-tight">
              I'm always looking to make new connections,
            </h1>
            <p className=" max-w-md text-sm md:text-lg">
              so drop me an email or shoot me a DM on " X ". Who knows where the
              conversation could lead?
            </p>
            <p className=" max-w-md text-sm md:text-lg">
              Let's explore the possibilities and see where it takes us!
            </p>
          </div>

          <div className="grid grid-cols-3 place-items-center md:place-items-start ">
            <div className="space-y-4">
              <Link href={"https://github.com/venkateshmadari"} target="_blank">
                <h3 className="text-primary text-xl capitalize flex items-center gap-2">
                  <IoLogoGithub className="text-shade" />
                  Github
                </h3>
              </Link>
            </div>

            <div className="space-y-4">
              <Link
                href={"https://www.linkedin.com/in/venkateshmadari"}
                target="_blank"
              >
                <h3 className="text-primary text-xl capitalize flex items-center gap-2">
                  <FaLinkedinIn className="text-shade" />
                  Linkedin
                </h3>
              </Link>
            </div>
            <div className="space-y-4">
              <Link href={"https://x.com/MadariVenk4216"} target="_blank">
                <h3 className="text-primary text-xl capitalize flex items-center gap-2">
                  <FaXTwitter className="text-shade" />X
                </h3>
              </Link>
            </div>
          </div>

          <div>
            <Link href={"https://venkateshmadari.netlify.app/"} target="_blank">
              <p className="text-xs underline capitalize flex items-center gap-1">
                visit my old portfolio <MdArrowOutward className="text-shade" />
              </p>
            </Link>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="flex-1">
          <div className="bg-third border border-gray-700 rounded-3xl p-8 lg:p-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-medium text-shade">Get in Touch</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-gray-700 bg-transparent py-3 focus:border-gray-400 focus:outline-none "
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-gray-700 bg-transparent py-3 focus:border-gray-400 focus:outline-none "
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border-b border-gray-700 bg-transparent py-3 focus:border-gray-400 focus:outline-none "
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border-b border-gray-700 bg-transparent py-3 focus:border-gray-400 focus:outline-none resize-none "
                  />
                </div>

                <button
                  type="submit"
                  className={`flex items-center gap-2 text-white px-6 py-3 rounded-full transition-colors
                    ${
                      buttonText === "Sending..."
                        ? "bg-[#9f1239]"
                        : buttonText === "Sent!"
                        ? "bg-[#065f46]"
                        : "bg-zinc-900 border border-gray-700 hover:bg-zinc-800"
                    }`}
                >
                  {buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
