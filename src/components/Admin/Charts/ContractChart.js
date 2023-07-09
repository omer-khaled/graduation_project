import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {faker} from '@faker-js/faker';
import Admin from '../../../logic/admin';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

function ContractChart() {
    let [regions,setRegions] = useState(undefined);
    let [counts,setCounts] = useState(undefined);
    useEffect(()=>{
        getdata();
    },[]);
    const getdata = async()=>{
        let call_api = new Admin();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/getContractsByRegion";
        let amin_token = sessionStorage.getItem('adminToken');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":amin_token}); 
        let arr1  = [];
        let arr2 = [];
        (returnedData.regions).forEach(element => {
            arr1.push(element['city name']);
            arr2.push(element['contract count']);
        });
        setRegions([...arr1]);
        setCounts([...arr2]);
    }
    const data = {
        labels:(regions!==undefined)?[...(regions)]:[],
        datasets: [
            {
                label: 'Regions',
                data: (regions!==undefined)?regions:[],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Counts of Contracts',
                data: (counts!==undefined)?counts:[],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    const options = {
        indexAxis: 'x' ,
        elements: {
            bar: {
            borderWidth: 2,
            },
        },
        data:(counts!==undefined)?[...(counts)]:[],
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
    return (
            <div className='cont'>
                <h1>Custom in Region Chart</h1>
                {(regions!==undefined)?<Bar className='charts' options={options} data={data} />:<div className='d-flex justify-content-center align-items-center p-2'><div className='empty'></div></div>}
            </div>
    )
}

export default ContractChart;

