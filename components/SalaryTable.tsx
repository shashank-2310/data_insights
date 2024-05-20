"use client";

import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Space } from 'antd';
import axios from 'axios';
import Graph from './Graph';
import Link from 'next/link';

interface SalaryData {
    work_year: number;
    job_title: string;
    salary_in_usd: number;
}

interface ProcessedData {
    year: number;
    numberOfJobs: number;
    averageSalary: number;
}

interface JobCount {
    job_title: string;
    count: number;
}

const SalaryTable: React.FC = () => {

    const [data, setData] = useState<ProcessedData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [jobCounts, setJobCounts] = useState<JobCount[]>([]);
    const [rawData, setRawData] = useState<SalaryData[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });


    useEffect(() => {
        axios.get<SalaryData[]>('/data/salaries.json')
            .then((response) => {
                const fetchedData = response.data;

                if (!Array.isArray(fetchedData)) {
                    throw new Error('Data format is incorrect. Expected an array.');
                }

                setRawData(fetchedData);

                const processedData: ProcessedData[] = fetchedData.reduce((acc, curr) => {
                    const existing = acc.find(item => item.year === curr.work_year);
                    if (existing) {
                        existing.numberOfJobs += 1;
                        existing.averageSalary = ((existing.averageSalary * (existing.numberOfJobs - 1)) + curr.salary_in_usd) / existing.numberOfJobs;
                    } else {
                        acc.push({ year: curr.work_year, numberOfJobs: 1, averageSalary: curr.salary_in_usd });
                    }
                    return acc;
                }, [] as ProcessedData[]);

                setData(processedData);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleRowClick = (record: ProcessedData) => {
        setSelectedYear(record.year);

        const jobData: JobCount[] = rawData
            .filter(item => item.work_year === record.year)
            .reduce((acc, curr) => {
                const existing = acc.find(item => item.job_title === curr.job_title);
                if (existing) {
                    existing.count += 1;
                } else {
                    acc.push({ job_title: curr.job_title, count: 1 });
                }
                return acc;
            }, [] as JobCount[]);

        setJobCounts(jobData);
    };

    const columns = [
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            sorter: (a: ProcessedData, b: ProcessedData) => a.year - b.year,
        },
        {
            title: 'Number of Jobs',
            dataIndex: 'numberOfJobs',
            key: 'numberOfJobs',
            sorter: (a: ProcessedData, b: ProcessedData) => a.numberOfJobs - b.numberOfJobs,
        },
        {
            title: 'Average Salary',
            dataIndex: 'averageSalary',
            key: 'averageSalary',
            sorter: (a: ProcessedData, b: ProcessedData) => a.averageSalary - b.averageSalary,
            render: (salary: number) => `$${salary.toLocaleString()}`,
        },
    ];

    const jobColumns = [
        {
            title: 'Job Title',
            dataIndex: 'job_title',
            key: 'job_title',
        },
        {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
        },
    ];

    const handlePaginationChange = (page: number, pageSize?: number) => {
        setPagination({ current: page, pageSize: pageSize || 10 });
    };

    if (loading) {
        return <Spin />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" />;
    }

    return (
        <Space direction="horizontal" className='w-full align-middle p-1 flex-between h-full gap-4 lg:gap-8 flex-shrink flex-col md:flex-row'>
            <div className="flex-col flex-center flex-shrink gap-2 text-center w-full">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="year"
                    pagination={false}
                    className='flex-shrink flex w-min md:w-max'
                    title={() => <div className='font-medium text-2xl text-blue-600'>Main Table</div>}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                />
                <p className='text-xs'>This table is based on <span className='text-blue-600 hover:text-black underline'><Link href={"https://www.kaggle.com/datasets/chopper53/machine-learning-engineer-salary-in-2024/data"}>Salaries</Link></span> dataset available on Kaggle.</p>
                <Graph data={data}/>
            </div>
            {selectedYear && (
                <Table
                    columns={jobColumns}
                    dataSource={jobCounts}
                    rowKey="job_title"
                    pagination={{
                        ...pagination,
                        total: jobCounts.length,
                        onChange: handlePaginationChange,
                    }}
                    title={() => <div className='font-medium text-center text-2xl text-blue-600'>{`Job Titles in ${selectedYear}`}</div>}
                    className='w-max flex flex-shrink'
                />
            )}
        </Space>
    );
};

export default SalaryTable;
