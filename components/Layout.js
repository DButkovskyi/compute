import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Layout({ title, children }) {
  const [show, setShow] = useState(false);
  const [menu, setMenu] = useState('open');

  return (
    <div className="h-full">
      <Head>
        <title>{title ? 'IridiumGPU | ' + title : 'IridiumGPU '}</title>
        <meta name="description" content="Cloud GPU" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="w-full overlay px-4 md:px-10 grid z-50 grid-cols-2 h-auto md:h-16 pt-5 md:pt-0 justify-between items-center bg-secondary text-secondary-light fixed top-0">
        <div className="flex space-x-2 pb-5 font-bold md:pb-0">
          <Image src="/logo.png" alt="Logo" width={30} height={30} />
          <h1 className="text-primary-dark">IridiumGPU</h1>
          <div className="h-2 w-2 rounded-full bg-primary-dark"></div>
        </div>

        <ul className="hidden md:flex space-x-6 justify-self-end items-center">
          <li className="menu">
            <Link href="/">Home</Link>
          </li>
          <li className="menu">
            <Link href="/pricing">Pricing</Link>
          </li>
          <li className="menu">
            <Link href="/docs">Docs</Link>
          </li>
          <li className="menu border py-2 font-extrabold px-3 rounded-md hover:border-primary-dark">
            <Link href="/login">Sign{'\u00A0'}In</Link>
          </li>
          <li className="menu border py-2 bg-secondary-light text-secondary-dark font-extrabold px-3 rounded-md hover:border-primary-dark">
            <Link href="/register">Get{'\u00A0'}Started</Link>
          </li>
        </ul>
        {menu === 'open' ? (
          <Image
            src="/menu.png"
            alt="Open Menu Logo"
            className="bg-icon pb-5 md:pb-0 flex justify-self-end md:hidden cursor-pointer"
            width={30}
            height={30}
            priority
            onClick={() => {
              setShow(true);
              setMenu('close');
            }}
          />
        ) : (
          <Image
            src="/close.png"
            alt="Close Menu Logo"
            className="bg-icon pb-5 md:pb-0 flex justify-self-end md:hidden cursor-pointer"
            width={20}
            height={20}
            priority
            onClick={() => {
              setShow(false);
              setMenu('open');
            }}
          />
        )}

        {show === true && (
          <ul className="absolute overlay px-4 md:px-10 text-base mt-16 top-0 left-0 bg-secondary md:hidden w-full col-span-2">
            <li className="focus:text-primary-dark w-full border py-2 font-extrabold px-3 rounded-md hover:border-primary-dark hover:text-primary-dark transition delay-200 ease-in-out duration-1000 pb-2 pt-2 hover:cursor-pointer flex hover:font-extrabold hover:scale-95">
              <Link className="w-full" href="/login">
                Sign{'\u00A0'}In
              </Link>
            </li>
            <li className="focus:text-primary-dark w-full border py-2 bg-secondary-light text-secondary-dark font-extrabold px-3 rounded-md hover:border-primary-dark hover:text-primary-dark transition delay-200 ease-in-out duration-1000 pb-2 pt-2 hover:cursor-pointer flex hover:font-extrabold hover:scale-95 mt-5">
              <Link className="w-full" href="/register">
                Get{'\u00A0'}Started
              </Link>
            </li>
            <li className="menu-block focus:text-primary-dark w-full">
              <Link className="w-full" href="/">
                Home
              </Link>
            </li>
            <li className="menu-block focus:text-primary-dark w-full">
              <Link className="w-full" href="/pricing">
                Pricing
              </Link>
            </li>
            <li className="focus:text-primary-dark w-full hover:text-primary-dark transition delay-200 ease-in-out duration-1000 border-b-none border-b-gray-800 pb-2 pt-2 hover:cursor-pointer flex hover:font-extrabold hover:scale-95">
              <Link className="w-full" href="/docs">
                Docs
              </Link>
            </li>
          </ul>
        )}
      </div>

      <main>
        <div className="w-full">{children}</div>
      </main>

      <footer className="w-full overlay grid z-50 py-4 h-auto justify-items-center items-center bg-secondary text-secondary-light">
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
        <p className="text-xs leading-9 tracking-wide text-gray-200 font-base">
          &copy; {new Date().toLocaleDateString('en-us', { year: 'numeric' })}{' '}
          IridiumGPU, ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
