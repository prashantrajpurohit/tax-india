"use client"
import { DialogDemo } from '@/components/reusableComponents/global-modal'
import GlobalTable from '@/components/reusableComponents/global-table'
import withLoading from '@/components/reusableComponents/with-loading-hoc'
import { GradientCardClass } from '@/config/helper/helper'
import { RoleApis } from '@/config/controller/httpApis'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import DesignationRows from './designation-rows'
import RoleForm from '@/components/role-form'


const { getRoleNames } = new RoleApis()

const MyComponentWithLoading = withLoading(GlobalTable);

const heading = [
    { name: "Sr. No", align: "center" },
    { name: "Name", align: "center" },
    { name: "Status", align: "center" },
    { name: "Action", align: "center" }
]

const Page = () => {
    const [openModal, setOpenModal] = useState(false)
    const [getData, setGetData] = useState<any | null>(null)
    const { data, isLoading, error } = useQuery({
        queryKey: ['roleNames'],
        queryFn: getRoleNames,
    })

    const handleClick = () => {
        setOpenModal(true)
    }

    const searching = () => {

    }

    const specialEvent = (e: any) => {
        setOpenModal(true)
        setGetData({ id: e?.id, name: e?.name, is_active: e?.is_active })
    }

    return (<>

        <MyComponentWithLoading
            label='Designation'
            heading={heading}
            loading={isLoading}
            rowdata={data?.data || []}
            Component={DesignationRows}
            searching={searching}
            clickEvent={handleClick}
            specialEvent={specialEvent}
        />


        <div className={GradientCardClass}>
            <DialogDemo
                size={500}
                open={openModal}
                onOpenChange={(isOpen) => setOpenModal(isOpen)}
                title={"Add Designation"}
                description={"Make changes to your profile here. Click save when you're done."}
                children={<RoleForm getData={getData} setOpenModal={setOpenModal} setGetData={setGetData} />}
            />
        </div>




    </>)
}

export default Page