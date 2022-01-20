import React from 'react'
import * as AiIcons from 'react-icons/ai'
import * as RiIcons from 'react-icons/ri'

export const AdministrationSidebarData = [
  {
    title: 'Security',
    icon: <AiIcons.AiOutlineHome />,
    link: '/Administration/security',
    iconOpened: <RiIcons.RiArrowDownSFill />,
    iconClosed: <RiIcons.RiArrowRightSFill />,
    subNav: [
      {
        title: 'Maintain User',
        path: '/Administration/Security/Maintain-User',
      },
      {
        title: 'Create Role',
        path: '/Administration/Security/Create-Role',
      },
      {
        title: 'Maintain Role',
        path: '/Administration/Security/Maintain-Role',
      },
      {
        title: 'Maintain Reference Data',
        path: '/Administration/Security/Maintain-Reference-Data',
      },
    ],
  },
  {
    title: 'Carrier',
    icon: <AiIcons.AiOutlineHome />,
    link: 'null',
    iconOpened: <RiIcons.RiArrowDownSFill />,
    iconClosed: <RiIcons.RiArrowRightSFill />,
    subNav: [
      {
        title: 'Create Carrier',
        path: '/Administration/Carrier/Create-Carrier',
      },
      {
        title: 'Maintain Carrier',
        path: '/Administration/Carrier/Maintain-Carrier',
      },
    ],
  },
]

export const CustomsSidebarData = [
  {
    title: 'NACCS Processing',
    icon: <AiIcons.AiOutlineHome />,
    link: 'null',
    iconOpened: <RiIcons.RiArrowDownSFill />,
    iconClosed: <RiIcons.RiArrowRightSFill />,
    subNav: [
      {
        title: 'NACCS Preview',
        path: '/Customs/NACCS-Processing/NACCS-Preview',
      },
      // {
      //   title: <Translation>{t => <p>{t('NACCS_Data_Enquiry_Report_label')}</p>}</Translation>,
      //   path: '/Customs/NACCS-Processing/NACCS-Data-Enquiry-Report',
      // },
      {
        title: 'NACCS File Generation',
        path: '/Customs/NACCS-Processing/NACCS-File-Generation',
      },
      {
        title: 'Maintain/Merge Pax',
        path: '/Customs/NACCS-Processing/Maintain-And-Merge-Pax',
      },
      {
        title: 'Maintain Bank Account',
        path: '/Customs/NACCS-Processing/Maintain-Bank-Account',
      },
    ],
  },
  {
    title: 'Reports',
    icon: <AiIcons.AiOutlineHome />,
    link: 'null',
    iconOpened: <RiIcons.RiArrowDownSFill />,
    iconClosed: <RiIcons.RiArrowRightSFill />,
    subNav: [
      {
        title: 'NACCS File Status Enquiry',
        path: '/Customs/Reports/NACCS-File-Status-Enquiry',
      },
      {
        title: 'NACCS File Summary Enquiry',
        path: '/Customs/Reports/NACCS-File-Summary-Enquiry',
      },
      {
        title: 'Stamp Duty Report',
        path: '/Customs/Reports/Stamp-Duty-Report',
      },
      {
        title: 'Daily NACCS Generation List Report',
        path: '/Customs/Reports/Daily-NACCS-Generation-List-Report',
      },
      {
        title: 'Bags in Pickup Counter Report',
        path: '/Customs/Reports/Bags-in-Pickup-Counter-Report',
      },
      {
        title: 'Duty Paid Tobacco Delivery Report',
        path: '/Customs/Reports/Duty-Paid-Tobacco-Delivery-Report',
      },

      {
        title: 'Duty Paid Tobacco Export Report',
        path: '/Customs/Reports/Duty-Paid-Tobacco-Export-Report',
      },
    ],
  },
]

export const BagTrackingSidebarData = [
  {
    title: 'Administration',
    icon: <AiIcons.AiOutlineHome />,
    link: 'null',
    iconOpened: <RiIcons.RiArrowDownSFill />,
    iconClosed: <RiIcons.RiArrowRightSFill />,
    subNav: [
      {
        title: 'Create Bin Location',
        path: '/Bag-Tracking/Administration/Create-Bin-Location',
      },
      {
        title: 'Maintain Bin Location',
        path: '/Bag-Tracking/Administration/Maintain-Bin-Location',
      },
      {
        title: 'Create Cage',
        path: '/Bag-Tracking/Administration/Create-Cage',
      },
      {
        title: 'Maintain Cage',
        path: '/Bag-Tracking/Administration/Maintain-Cage',
      },
      {
        title: 'Create Truck',
        path: '/Bag-Tracking/Administration/Create-Truck',
      },
      {
        title: 'Maintain Truck',
        path: '/Bag-Tracking/Administration/Maintain-Truck',
      },
      {
        title: 'Assign Sea Bin',
        path: '/Bag-Tracking/Administration/Assign-Sea-Bin',
      },
      {
        title: 'Release Bags',
        path: '/Bag-Tracking/Administration/Release-Bags',
      },
      {
        title: 'Airport Override Bagtracking',
        path: '/Bag-Tracking/Administration/Airport-Override-Bagtracking',
      },
      {
        title: 'Warehouse Override Bagtracking',
        path: '/Bag-Tracking/Administration/Warehouse-Override-Bagtracking',
      },
      {
        title: 'Delivery Manifest',
        path: '/Bag-Tracking/Administration/Delivery-Manifest',
      },
      {
        title: 'Picklist Generation',
        path: '/Bag-Tracking/Administration/Picklist-Generation',
      },
    ],
  },
  {
    title: 'Reports',
    icon: <AiIcons.AiOutlineHome />,
    link: 'null',
    iconOpened: <RiIcons.RiArrowDownSFill />,
    iconClosed: <RiIcons.RiArrowRightSFill />,
    subNav: [
      {
        title: 'Bag Tracking Reports',
        path: '/Bag-Tracking/Reports/Bag-Tracking-Reports',
      },
      {
        title: 'PAX Flight Change Notification',
        path: '/Bag-Tracking/Reports/PAX-Flight-Change-Notification',
      },
      {
        title: 'Customer Refund Notification',
        path: '/Bag-Tracking/Reports/Customer-Refund-Notification',
      },
    ],
  },
]

export const sideBarDataManipilated = [
  { mainMenu: 'administration', menu: 'Security', subMenu: 'Maintain User' },
  { mainMenu: 'administration', menu: 'Security', subMenu: 'Create Role' },
  { mainMenu: 'administration', menu: 'Security', subMenu: 'Maintain Role' },
  { mainMenu: 'administration', menu: 'Security', subMenu: 'Maintain Reference Data' },
  { mainMenu: 'administration', menu: 'Carrier', subMenu: 'Create Carrier' },
  { mainMenu: 'administration', menu: 'Carrier', subMenu: 'Maintain Carrier' },
  { mainMenu: 'customs', menu: 'NACCS Processing', subMenu: 'NACCS Preview' },
  { mainMenu: 'customs', menu: 'NACCS Processing', subMenu: 'NACCS File Generation' },
  { mainMenu: 'customs', menu: 'NACCS Processing', subMenu: 'Maintain/Merge Pax' },
  { mainMenu: 'customs', menu: 'NACCS Processing', subMenu: 'Maintain Bank Account' },
  { mainMenu: 'customs', menu: 'Reports', subMenu: 'NACCS File Status Enquiry' },
  { mainMenu: 'customs', menu: 'Reports', subMenu: 'NACCS File Summary Enquiry' },
  { mainMenu: 'customs', menu: 'Reports', subMenu: 'Stamp Duty Report' },
  { mainMenu: 'customs', menu: 'Reports', subMenu: 'Daily NACCS Generation List Report' },
  { mainMenu: 'customs', menu: 'Reports', subMenu: 'Bags in Pickup Counter Report' },
  { mainMenu: 'customs', menu: 'Reports', subMenu: 'Duty Paid Tobacco Delivery Report' },
  { mainMenu: 'customs', menu: 'Reports', subMenu: 'Duty Paid Tobacco Export Report' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Create Bin Location' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Maintain Bin Location' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Create Cage' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Maintain Cage' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Create Truck' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Maintain Truck' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Assign Sea Bin' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Release Bags' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Airport Override Bagtracking' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Warehouse Override Bagtracking' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Delivery Manifest' },
  { mainMenu: 'bag tracking', menu: 'Administration', subMenu: 'Picklist Generation' },
  { mainMenu: 'bag tracking', menu: 'Reports', subMenu: 'Bag Tracking Reports' },
  { mainMenu: 'bag tracking', menu: 'Reports', subMenu: 'Customer Refund Notification' },
  { mainMenu: 'bag tracking', menu: 'Reports', subMenu: 'PAX Flight Change Notification' },
  { mainMenu: 'Customs Home', menu: 'Customs Home', subMenu: 'Customs Home' },
]
