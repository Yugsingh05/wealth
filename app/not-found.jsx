"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming you're using shadcn/ui
import { PiggyBank } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <PiggyBank className="w-24 h-24 text-yellow-400" />
        <h1 className="text-8xl font-extrabold drop-shadow-lg">404</h1>
        <p className="text-2xl text-gray-300">Oops! Seems like your savings are misplaced.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-8"
      >
        <Link href="/">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500 py-2 px-6 text-lg rounded-full shadow-lg hover:cursor-pointer">
            Return to Dashboard
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-4 text-sm text-gray-300"
      >
        Need help tracking your finances? Visit our budgeting tips or savings calculator.
      </motion.div>
    </div>
  );
};

export default NotFound;