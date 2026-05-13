import React from 'react'
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturnLight } from "react-icons/pi";
import { IoWalletOutline } from "react-icons/io5";
import { LiaGiftSolid } from "react-icons/lia";
import { BiSupport } from "react-icons/bi";
import { Form, Link } from 'react-router-dom';
import { IoChatboxOutline } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import Button from '@mui/material/Button';
import { MyContext } from '../../App';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Footer = () => {
  const context = React.useContext(MyContext);
  const isMobile = context?.windowWidth < 992;

  return (
    <footer className='py-6 bg-[#fdfdfd] border-t border-gray-100'>
      <div className="container mx-auto">
        
        <div className="flex items-center lg:justify-center gap-4 lg:gap-2 py-6 lg:py-8 px-4 lg:px-5 overflow-x-auto no-scrollbar scrollableBox footerBoxWrap">
          {[
            { icon: <LiaShippingFastSolid />, title: "Free Delivery", desc: "For all Orders Over ₹300" },
            { icon: <IoWalletOutline />, title: "Secured Payment", desc: "Payment card accepted" },
            { icon: <LiaGiftSolid />, title: "Special Gifts", desc: "Our First Product Order" },
            { icon: <BiSupport />, title: "Support 24/7", desc: "Contact us Anytime" }
          ].map((item, index) => (
            <div key={index} className="col flex items-center justify-center flex-col group min-w-37.5 lg:w-[10%] shrink-0">
              <div className='text-[40px] items-center justify-center flex transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1'>
                {item.icon}
              </div>
              <h3 className='text-[15px] lg:text-[16px] font-semibold mt-3 text-center'>{item.title}</h3>
              <p className='text-[12px] font-medium text-center text-gray-500'>{item.desc}</p>
            </div>
          ))}
        </div>

        <hr className="border-[rgba(0,0,0,0.1)]" />

        <div className="footer flex px-4 lg:px-0 flex-col lg:flex-row py-8 gap-8 lg:gap-0">
          
          {/* Part 1: Contact Info */}
          <div className="part1 w-full lg:w-[25%] lg:border-r border-[rgba(0,0,0,0.1)] pr-0 lg:pr-4">
            <h2 className='text-[18px] font-semibold mb-4'>Contact us</h2>
            <p className='text-[13px] font-normal pb-4 leading-relaxed'>
              Foodie <br />
              203 - Noida
            </p>

            <Link className='link text-[13px] text-blue-600' to="mailto:sales@yourcompany.com">support@foodie.com</Link>

            <span className='text-[22px] font-semibold block w-full mt-3 text-orange-500 mb-5'>(+91) 0123-456-789</span>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md w-fit lg:w-full">
              <IoChatboxOutline className='text-[40px] text-orange-500' />
              <span className='text-[15px] font-semibold leading-tight'>
                Online Chat<br />
                <span className="text-[12px] font-normal text-gray-500">Get Expert help</span>
              </span>
            </div>
          </div>

          {/* Part 2: Links */}
          <div className="part2 w-full lg:w-[40%] flex pl-0 lg:pl-8">
            <div className="part2_col1 w-[50%]">
              <h2 className='text-[18px] font-semibold mb-4'>Comapny</h2>
              <ul className="list">
                {["About-Us", "Careers", "Team", "Foodie-Corporate", "Secure-payment", "Login", "Terms&conditions"].map((link) => (
                  <li key={link} className="list-none text-[14px] w-full mb-2">
                    <Link to={link} className='link hover:text-orange-500'>{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="part2_col2 w-[50%]">
              <h2 className='text-[18px] font-semibold mb-4'>Contact Us</h2>
              <ul className="list">
                {["Help& Support", "Partner With Us", "Ride with us"].map((link) => (
                  <li key={link} className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className='link hover:text-orange-500'>{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Part 3: Newsletter */}
          <div className="part2 w-full lg:w-[35%] flex pl-0 lg:pl-8 flex-col mt-5 lg:mt-0">
            <h2 className='text-[18px] font-semibold mb-2 lg:mb-4'>Subscribe to newsletter</h2>
            <p className='text-[13px] text-gray-600 mb-5'>Subscribe to our latest newsletter to get news about special discounts.</p>

            <form className='flex flex-col gap-3' onSubmit={(e) => e.preventDefault()}>
              <input 
                type='email' 
                className='w-full h-11.25 border outline-none px-4 rounded-sm focus:border-orange-500 transition-all' 
                placeholder='Your Email Address' 
              />
              <Button className='btn-org w-full! lg:w-fit!'>Subscribe</Button>

              <FormControlLabel
                className='mt-2 block'
                control={<Checkbox size="small" />}
                label={<span className="text-[12px]">I agree to the terms and the privacy policy.</span>}
              />
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
