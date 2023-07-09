import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {faker} from '@faker-js/faker';
import Admin from '../../../logic/admin';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'vertical Bar Chart',
        },
    }
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];


function VBChart() {
    let [worker,setWorker] = useState(undefined);
    let [customer,setCustomer] = useState(undefined);
    useEffect(()=>{
        getdata();
    },[]);
    const getdata = async()=>{
        let call_api = new Admin();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/getUsersByMonth";
        let amin_token = sessionStorage.getItem('adminToken');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":amin_token});
        setWorker([...(returnedData.workers)]);
        setCustomer([...(returnedData.customer)]);
    }
    const data = {
        labels,
        datasets: [
            {
                label: 'Customer',
                data: (customer!==undefined)?customer:[],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Worker',
                data:(worker!==undefined)?worker:[],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    return (
        <div className='cont'>
            <h1>workers and customers over years</h1>
            {(customer!==undefined)?<Bar className='charts' options={options}  data={data} />:<div className='d-flex justify-content-center align-items-center p-2'><div className='empty'></div></div>}
        </div>
    )
}

export default VBChart;