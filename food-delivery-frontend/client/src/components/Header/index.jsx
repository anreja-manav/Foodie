import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../../Assests/Logo.jpg"
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { FaCartShopping } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { MdLiveHelp } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Tooltip from '@mui/material/Tooltip';
import { MyContext } from "../../App";
import { FaRegUser } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { IoClose } from "react-icons/io5";
import Search from "../Search";
import { IoIosArrowDown } from "react-icons/io";


const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {

  const context = useContext(MyContext);
  const history = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isOpenCatPanel, setIsOpenCatPanel] = React.useState(false);
  const [isOpenNavPanel, setIsOpenNavPanel] = React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    localStorage.clear();
    context?.setIsLogin(false);
    context?.setUserData(null);
    context?.setCartData([]);
    context.alertBox("success", "Logged out successfully");
    
    history("");
  };

  return (
    <>
      <header className= "bg-white w-full! sticky top-0 z-50">
          <div className=" header  flex flex-row items-center justify-between gap-4 lg:gap-3 border-5-white mb-3!">
            

            <div className="col1 w-[30%] lg:w-[15%] relative group overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
              <Link to={"/"}>
                <img src={logo} alt="Logo" className="relative z-10" />
              </Link>
            </div>

            <div className="location flex justify-center items-center ">
              <IconButton aria-label="location" className="hover:text-orange-600! text-black! font-bold! text-[18px]!  px-2 " onClick={() => context.toggleLocationPanel(true)}>
             <h3 className="underline! ">Other</h3> <span className=" pl-3 text-[16px]! no-underline! text-gray-700 hover:text-gray-400">{context?.formFields.city}</span>
              
              <IoIosArrowDown className="text-[16px]! text-orange-600!" />
              </IconButton>
            </div>

            {context.windowWidth >= 992 && (
              <div className="col2 lg:w-[35%] static">
                <Search />
              </div>
            )}

            {context.windowWidth < 992 && context.openSearchPanel && (
              <>

                <div
                  className="fixed inset-0 bg-black/40 z-40"
                  onClick={() => context.setOpenSearchPanel(false)}
                />

                <div
                  className={`fixed top-0 left-0 h-full w-[70%] bg-white z-50 transform transition-transform duration-300 translate-x-0`}
                >
                  <div className="pl-3">
                    <Button
                      onClick={() => context.setOpenSearchPanel(false)}
                      className="absolute top-3 right-3 w-4 h-8 rounded-full! bg-gray-100 flex items-center justify-center text-black!"
                    >
                      <IoClose size={18} />
                    </Button>
                  </div>

                  <div className="pt-8 px-4">
                    <Search />
                  </div>
                </div>
              </>
            )}
            <div className="col3 w-[10%] lg:w-[30%] flex items-center pl-7 text-black!">
              <ul className="flex items-center justify-center gap-0 lg:gap-3 w-full">
                {
                  context.isLogin === false && context.windowWidth > 992 ?
                    (
                      <li className="list-none">
                        <Tooltip title="Login" placement="top">
                            <Link
                            to="/login"
                            className="link transition text-[13px] sm:text-[15px] font-bold"
                            >
                                <IconButton aria-label="login">
                                    <StyledBadge
                                        color="secondary"
                                    >
                                        <HiOutlineUserCircle />
                                    </StyledBadge>
                                </IconButton>
                            Login
                            
                            </Link>{" "}
                        </Tooltip>
                      </li>
                    ) : (
                      <>
                        {
                          context?.windowWidth > 992 &&
                          <>
                            <Button className="text-black! myAccountWrap flex items-center gap-3" onClick={handleClick}>
                              <Button className="w-10! h-10! min-w-10! rounded-full! bg-[#f1f1f1]!">
                                <FaRegUser className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                              </Button>
                              <div className="info flex flex-col max-w-40 ">
                                <h4 className=" leading-3 text-[13px] text-black! font-medium mb-0 capitalize text-left justify-start truncate">{context?.userData?.Name}</h4>
                              </div>
                            </Button>
                            <Menu
                              anchorEl={anchorEl}
                              id="account-menu"
                              open={open}
                              onClose={handleClose}
                              onClick={handleClose}
                              slotProps={{
                                paper: {
                                  elevation: 0,
                                  sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                      width: 32,
                                      height: 32,
                                      ml: -0.5,
                                      mr: 1,
                                    },
                                    '&::before': {
                                      content: '""',
                                      display: 'block',
                                      position: 'absolute',
                                      top: 0,
                                      right: 14,
                                      width: 10,
                                      height: 10,
                                      bgcolor: 'background.paper',
                                      transform: 'translateY(-50%) rotate(45deg)',
                                      zIndex: 0,
                                    },
                                  },
                                },
                              }}
                              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                              <Link to="/my-account" className="w-full block">
                                <MenuItem onClick={handleClose} className="flex gap-2 py-2!">
                                  <FaRegUser className="text-[18px]" /><span className="text-[14px]">My Account</span>
                                </MenuItem>
                              </Link>
                              <Link to="/my-orders" className="w-full block">
                                <MenuItem onClick={handleClose} className="flex gap-2 py-2!">
                                  <IoBagCheckOutline className="text-[18px]" /> <span className="text-[14px]">Orders</span>
                                </MenuItem>
                              </Link>
                              <Link>
                                <MenuItem className="flex gap-2 py-2!">
                                  <IoIosLogOut className="text-[18px]" /><span className="text-[14px]" onClick={logout}>Logout</span>
                                </MenuItem>
                              </Link>

                              <Divider />
                            </Menu>
                          </>
                        }

                      </>
                    )}

                {
                  context?.windowWidth > 992 &&
                  <li>
                    <Tooltip title="Help" placement="top">
                      <Link
                        to="/help"
                        className="link transition text-[13px] sm:text-[15px] font-bold"
                      >
                        <IconButton aria-label="help">
                          <StyledBadge
                            color="secondary"
                          >
                            <MdLiveHelp />
                          </StyledBadge>
                        </IconButton>
                        Help
                        
                      </Link>
                    </Tooltip>
                  </li>
                }

                <li>
                  <Tooltip title="Cart" placement="top">
                    <Link
                        to="/cart"
                        className="link transition text-[13px] sm:text-[15px] font-bold"
                      >
                        <IconButton aria-label="cart">
                            <StyledBadge badgeContent={context?.cartData?.length !== 0 ? context?.cartData?.length : 0} color="secondary">
                                <FaCartShopping />
                            </StyledBadge>
                        </IconButton>
                        Cart

                      </Link>
                    
                  </Tooltip>
                </li>

              </ul>
            </div>
          </div>
      </header>
    </>
  );
};

export default Header;