import React, { useState } from 'react';
import api from '@/api/axiosConfig.jsx';
import { toast } from 'react-hot-toast';
import contactBg from '@/assets/images/bg_images/contact.png'; // 1. Import the background image

// Updated FAQ data for a fashion clothing website
const faqData = [
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase. Items must be unworn, unwashed, and with all original tags attached. You can initiate a return through your account page or by contacting our customer service."
  },
  {
    question: "How can I find my correct size?",
    answer: "You can find a detailed size chart on each product page. We also provide model measurements and fit recommendations to help you make the best choice. If you're still unsure, our customer support team is happy to help!"
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 100 countries! Shipping costs and delivery times vary by destination. You can see the specific details and options for your country at checkout."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can also find your tracking information in the 'Order History' section of your account."
  },
  {
    question: "How should I care for my garments?",
    answer: "Care instructions are listed on the label of each garment and on the product page. We generally recommend washing in cold water and hanging to dry to maintain the quality and longevity of your clothes."
  }
];

export default function Contact() {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      message: '',
  });

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      toast.promise(
          api.post('/api/contact/', formData),
          {
              loading: 'Sending your message...',
              success: () => {
                  setFormData({ name: '', email: '', phone: '', message: '' }); // Clear form
                  return 'Message sent successfully!';
              },
              error: 'Failed to send message.',
          }
      );
  };

  return (
    <div
      className="relative bg-cover bg-center bg-fixed min-h-screen -m-4 py-16 sm:py-24 rounded-xl overflow-hidden"
      style={{ backgroundImage: `url(${contactBg})` }}
    >
      
      <div className="relative container  font-bold mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Form Section */}
        <div className="p-8 md:p-12 rounded-xl shadow-lg text-black-600">
          <h1 className="text-3xl font-bold text-black-800 mb-6">Contact Us</h1>
          <p className="text-black-600 mb-8">
            Have a question or a special request? Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6  ">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black-700">Name</label>
              <input 
                type="text" 
                name="name" 
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" 
                required 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black-700">Email Address</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" 
                required 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-black-700">Phone Number (Optional)</label>
              <input 
                type="tel" 
                name="phone" 
                id="phone" 
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" 
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-black-700">Your Inquiry</label>
              <textarea 
                name="message" 
                id="message" 
                rows="4" 
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" 
                required
              ></textarea>
            </div>
            <div>
              <button 
                type="submit" 
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* FAQ Section */}
        <div className=" p-8 md:p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-black-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="border-b border-gray-200 py-4">
                <button 
                  onClick={() => handleToggle(index)} 
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-black-700 hover:text-red-700 transition-colors"
                >
                  {item.question}
                  <svg 
                    className={`w-6 h-6 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`} 
                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <p className="text-black-500">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}