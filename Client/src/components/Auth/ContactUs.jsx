import { useState } from "react";
import logo from "../../assets/logo.png";
import { contactApi } from "../../api/AuthApi";


const ContactUs = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      message: "",
    });
  
    const [isSubmitted, setIsSubmitted] = useState(false);
  
    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        // Simple validation
        if (!formData.name || !formData.email || !formData.message) {
          alert("All fields are required!");
          return;
        }
      
        try {
          const response = await contactApi(formData);
      
          if (response.status === 200) {
            setIsSubmitted(true);
            setFormData({ name: "", email: "", message: "" }); // Reset form
            alert("Your message has been sent successfully!");
          } else {
            alert("Failed to send the message. Please try again.");
          }
        } catch (error) {
          console.error("Error submitting the form:", error);
          alert("An error occurred. Please try again.");
        }
      };

    return (
        <section className="bg-grey-darker text-white py-16 px-4 md:px-16" id="contact">
        <h2 className="text-2xl md:text-3xl font-bold text-green-default mb-6 text-center">
          Contact Us
        </h2>
        <div className="container mx-auto flex flex- items-center gap-12">
          <div className="w-full md:w-2/3">
          {isSubmitted ? (
             <div className="text-green-default text-center font-semibold">
             Thank you for contacting us! We&apos;ll get back to you soon.
           </div>
         ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-green-default bg-transparent text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-green-default bg-transparent text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-green-default bg-transparent text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto bg-green-default text-gray-900 font-semibold py-2 px-6 rounded-lg hover:bg-green-500 transition"
              >
                Send
              </button>
            </form>
             )}
          </div>
          <div className="w-full text-center">
            <img
              src={logo}
              alt="Fix-Mate Logo"
              className="w-56 h-60 mx-auto md:mb-6"
            />
            <p className="text-white-medium text-sm md:text-base">
              Connecting You to Trusted Local Experts, Anytime, Anywhere!
            </p>
            <p className="text-green-default font-medium mt-2">
              support@fixmate.com | +91 8547623859
            </p>
          </div>
        </div>
      </section>
    );
};

export default ContactUs;
