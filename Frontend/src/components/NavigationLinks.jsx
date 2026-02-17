import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SharedLinks from "./SharedLinks";

const navLinks = [
  {
    to: "/htmlcssjs",
    text: "HTML, CSS, JS",
    classes: "bg-gradient-to-br from-indigo-500 to-purple-600 motion-delay-[400ms]",
  },
  {
    to: "/python",
    text: "Python",
    classes: "bg-gradient-to-br from-blue-500 to-indigo-600 motion-delay-[450ms]",
  },
  {
    to: "/javascript",
    text: "Javascript",
    classes: "bg-gradient-to-br from-amber-400 to-orange-500 motion-delay-[500ms]",
  },
  {
    to: "/c",
    text: "C",
    classes: "bg-gradient-to-br from-slate-600 to-slate-800 motion-delay-[550ms]",
  },
  {
    to: "/cpp",
    text: "C++",
    classes: "bg-gradient-to-br from-blue-600 to-cyan-700 motion-delay-[600ms]",
  },
  {
    to: "/java",
    text: "Java",
    classes: "bg-gradient-to-br from-orange-600 to-red-700 motion-delay-[650ms]",
  },
  {
    to: "/csharp",
    text: "C#",
    classes: "bg-gradient-to-br from-purple-600 to-indigo-800 motion-delay-[700ms]",
  },
  {
    to: "/rust",
    text: "Rust",
    classes: "bg-gradient-to-br from-orange-700 to-amber-900 motion-delay-[750ms]",
  },
  {
    to: "/go",
    text: "Go",
    classes: "bg-gradient-to-br from-cyan-500 to-blue-600 motion-delay-[800ms]",
  },
  {
    to: "/verilog",
    text: "Verilog",
    classes: "bg-gradient-to-br from-gray-600 to-zinc-800 motion-delay-[850ms]",
  },
  {
    to: "/sql",
    text: "SQL",
    classes: "bg-gradient-to-br from-indigo-600 to-blue-700 motion-delay-[900ms]",
  },
  {
    to: "/mongodb",
    text: "MongoDB",
    classes: "bg-gradient-to-br from-emerald-500 to-teal-700 motion-delay-[950ms]",
  },
  {
    to: "/swift",
    text: "Swift",
    classes: "bg-gradient-to-br from-orange-500 to-rose-600 motion-delay-[1000ms]",
  },
  {
    to: "/ruby",
    text: "Ruby",
    classes: "bg-gradient-to-br from-rose-600 to-red-800 motion-delay-[1050ms]",
  },
  {
    to: "/typescript",
    text: "Typescript",
    classes: "bg-gradient-to-br from-blue-600 to-indigo-700 motion-delay-[1100ms]",
  },
  {
    to: "/dart",
    text: "Dart",
    classes: "bg-gradient-to-br from-cyan-400 to-blue-500 motion-delay-[1150ms]",
  },
  {
    to: "/kotlin",
    text: "Kotlin",
    classes: "bg-gradient-to-br from-violet-600 to-purple-800 motion-delay-[1200ms]",
  },
  {
    to: "/perl",
    text: "Perl",
    classes: "bg-gradient-to-br from-pink-600 to-rose-700 motion-delay-[1250ms]",
  },
  {
    to: "/scala",
    text: "Scala",
    classes: "bg-gradient-to-br from-red-600 to-rose-700 motion-delay-[1300ms]",
  },
  {
    to: "/julia",
    text: "Julia",
    classes: "bg-gradient-to-br from-emerald-600 to-green-800 motion-delay-[1350ms]",
  },
];

const NavigationLinks = () => {
  const baseUrl = window.location.origin;

  useEffect(() => {
    document.title = "Online IDE - Glad432";
  }, []);

  return (
    <>
      <div className="flex justify-center items-center min-h-[65vh] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-4 px-4 sm:px-6 md:px-8 lg:px-8">
          {navLinks.map(({ to, text, classes }) => (
            <Link
              key={to}
              to={`${baseUrl}${to}`}
              aria-label={`Navigate to ${text} Editor`}
              title={text}
              className={`w-full px-8 py-4 text-xl font-semibold motion-preset-rebound-down ${classes} text-white text-center rounded-lg shadow-lg whitespace-nowrap overflow-hidden text-ellipsis hover:scale-105 transform transition-all duration-300 sm:px-6 sm:py-3 sm:text-lg md:px-8 md:py-4 lg:px-8 lg:py-4`}
            >
              {text}
            </Link>
          ))}
        </div>
      </div>
      <SharedLinks />
    </>
  );
};

export default NavigationLinks;
