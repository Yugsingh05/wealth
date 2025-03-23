import { GetUserAccounts } from '@/actions/dashboard'
import { getTransaction } from '@/actions/transaction';
import AddTransactionForm from '@/components/AddTransactionForm';
import { defaultCategories } from '@/data/categories';
import React from 'react'

const Transaction = async({searchParams }) => {
  const accounts = await GetUserAccounts();
  const editId = await searchParams?.edit;

  let initialData = null;
  if(editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }
  return (
    <div className='max-w-3xl mx-auto px-5'>
      <div className='flex justify-center md:justify-normal mb-8'>
        <h1 className='text-5xl gradient-title'>{editId ? "Edit" : "Add"} Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  )
}

export default Transaction