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

function HBChart() {
    let [categories,setCategories] = useState(undefined);
    let [counts,setCounts] = useState(undefined);
    useEffect(()=>{
        getdata();
    },[]);
    const getdata = async()=>{
        let call_api = new Admin();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/getWorkerByCategory";
        let amin_token = sessionStorage.getItem('adminToken');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":amin_token}); 
        let arr1  = [];
        let arr2 = [];
        (returnedData.categories).forEach(element => {
            arr1.push(element.category);
            arr2.push(element.count);
        });
        setCategories([...arr1]);
        setCounts([...arr2]);
    }
    const data = {
        labels:(categories!==undefined)?[...(categories)]:[],
        datasets: [
            {
                label: 'Categories',
                data: (categories!==undefined)?categories:[],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Counts of workers',
                data: (counts!==undefined)?counts:[],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    const options = {
        indexAxis: 'y' ,
        elements: {
            bar: {
            borderWidth: 2,
            },
        },
        data:(counts!==undefined)?[...(counts)]:[],
        responsive: true,
        plugins: {
            legend: {
            position: 'right',
            },
            title: {
            display: true,
            text: 'Horizontal Bar Chart',
            },
        },
    };
    return (
        <div className='cont'>
            <h1>workers in categories</h1>
            {(categories!==undefined)?<Bar className='charts' options={options}  data={data} />:<div className='d-flex justify-content-center align-items-center p-2'><div className='empty'></div></div>}
        </div>
    )
}

export default HBChart;