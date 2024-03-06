import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';

function UserSidebar({ title, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [, setMobileNavOpen] = useState(false);
  const [showMobileNavMenu, setShowMobileNavMenu] = useState(false);
  const router = useRouter();
  const isLoggedIn = localStorage.getItem('authToken');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  if (!isLoggedIn) {
    router.push('/login');
  }
  const logoutUser = () => {
    localStorage.clear();
    router.push('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) {
        setShowMobileNavMenu(false);
        setMobileNavOpen(false);
      } else if (window.innerWidth < 1000) {
        setCollapsed(collapsed);
        setShowMobileNavMenu(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [collapsed]);

  return (
    <div>
      <Head>
        <title>{title ? 'IridiumGPU | ' + title : 'IridiumGPU '}</title>
        <meta name="description" content="Cloud GPU" />
      </Head>
      <div className="flex h-full">
        <Sidebar
          width="150px"
          collapsed={showMobileNavMenu ? !collapsed : collapsed}
          collapsedWidth="70px"
          transitionDuration={1000}
          className="text-xs lg:text-sm"
        >
          <div className={showMobileNavMenu ? 'invisible' : 'sidebarHeader'}>
            <Menu>
              <MenuItem
                className="hamburgerMenu"
                icon={
                  <Image
                    src="/menu.png"
                    alt="Open Menu Logo"
                    className="bg-i cursor-pointer"
                    width={25}
                    height={25}
                    priority
                  />
                }
                onClick={toggleSidebar}
              />
            </Menu>
          </div>
          <Menu>
            <Link href="/deploy">
              <MenuItem
                icon={
                  <Image
                    src="/deploy.png"
                    width={20}
                    height={20}
                    alt="deploy logo"
                    className="bg"
                  />
                }
              >
                {' '}
                Deploy
              </MenuItem>
            </Link>
            <Link href="/resources">
              <MenuItem
                icon={
                  <Image
                    src="/resources.png"
                    width={20}
                    height={20}
                    alt="resources logo"
                    className="bg"
                  />
                }
              >
                {' '}
                Resources
              </MenuItem>
            </Link>
            <Link href="/storage">
              <MenuItem
                icon={
                  <Image
                    src="/storage.png"
                    width={20}
                    height={20}
                    alt="storage logo"
                    className="bg"
                  />
                }
              >
                {' '}
                Storage
              </MenuItem>
            </Link>
            <Link href="/usage">
              <MenuItem
                icon={
                  <Image
                    src="/pay.png"
                    width={20}
                    height={20}
                    alt="billing logo"
                    className="bg"
                  />
                }
              >
                {' '}
                Usage
              </MenuItem>
            </Link>
            <SubMenu
              label="Profile"
              icon={
                <Image
                  src="/profile.png"
                  width={20}
                  height={20}
                  alt="Profile logo"
                  className="bg"
                />
              }
            >
              <Link href="/profile">
                <MenuItem
                  icon={
                    <Image
                      src="/info.png"
                      width={20}
                      height={20}
                      alt="info logo"
                      className="bg"
                    />
                  }
                >
                  {' '}
                  Info{' '}
                </MenuItem>
              </Link>
              <Link href="/settings">
                <MenuItem
                  icon={
                    <Image
                      src="/settings.png"
                      width={20}
                      height={20}
                      alt="settings logo"
                      className="bg"
                    />
                  }
                >
                  {' '}
                  Settings{' '}
                </MenuItem>
              </Link>
            </SubMenu>
            {/* <Link href="/billing"> */}
            <MenuItem
              icon={
                <Image
                  src="/power.png"
                  width={20}
                  height={20}
                  alt="billing logo"
                  className="bg"
                />
              }
              onClick={logoutUser}
            >
              {' '}
              Log-out
            </MenuItem>
            {/* </Link> */}
          </Menu>
        </Sidebar>

        <main className="w-full h-full">
          <div className="w-full">{children}</div>

          <footer className="w-full overlay grid z-50 py-4 h-auto justify-items-center items-center bg-secondary text-secondary-light bottom-0">
            <div className="flex space-x-6">
              <Link href="https://github.com/Hannah-28/" target="_blank">
                <Image
                  src="/github.png"
                  width={15}
                  height={15}
                  alt="github logo"
                  className="bg-icon icon"
                />
              </Link>
              <Link href="mailto:oluronbianu@gmail.com">
                <Image
                  src="/mail.png"
                  width={15}
                  height={15}
                  alt="mail logo"
                  className="bg-icon icon"
                />
              </Link>
              <Link
                href="https://api.whatsapp.com/send/?phone=%2B2347055625874&text&type=phone_number&app_absent=0"
                target="_blank"
              >
                <Image
                  src="/whatsapp.png"
                  width={15}
                  height={15}
                  alt="whatsapp logo"
                  className="bg-icon icon"
                />
              </Link>
              <Link
                href="https://www.linkedin.com/in/anuoluwapo-olurombi-633478173/"
                target="_blank"
              >
                <Image
                  src="/linkedin.png"
                  width={15}
                  height={15}
                  alt="linkedin logo"
                  className="bg-icon icon"
                />
              </Link>
              <Link
                href="https://instagram.com/anu__oh?igshid=MzNlNGNkZWQ4Mg=="
                target="_blank"
              >
                <Image
                  src="/instagram.png"
                  width={15}
                  height={15}
                  alt="instagram logo"
                  className="bg-icon icon"
                />
              </Link>
              <Link
                href="https://twitter.com/anu__oh?t=rTiPknuyDKemZdMF6x6_UQ&s=09"
                target="_blank"
              >
                <Image
                  src="/twitter.png"
                  width={15}
                  height={15}
                  alt="twitter logo"
                  className="bg-icon icon"
                />
              </Link>
            </div>
            <p className="text-xs leading-9 tracking-wide text-gray-200 font-thin">
              &copy;{' '}
              {new Date().toLocaleDateString('en-us', { year: 'numeric' })}{' '}
              IridiumGPU, ALL RIGHTS RESERVED.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(UserSidebar), { ssr: false });
