import React,{useMemo , useState , useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';

import { Container, Content, Filters } from "./styles";
import ContentHeader from "../../Components/ContentHeader";
import SelectInput from "../../Components/SelectInput";
import HistoryFinanceCard from "../../Components/HistoryFinanceCard";

import gains from "../../Repositories/gains";
import expenses from "../../Repositories/expenses";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import listOfMonths from "../../utils/months";

interface IData{
    id: string;
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}


export const List: React.FC = () => {
    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
    const [frequencyFilterSelected, setFrequencyFilterSelected] = useState(['recorrente','eventual'])

    const { type } = useParams();
   
    const pageData = useMemo(() =>{
        return type ==='entry-balance' ?
            {
                title:'Entradas',
                lineColor: '#4E41f0',
                data: gains
            
        }
        :
        {
                title:'Saídas',
                lineColor: '#CC2A2C',
                data: expenses
        }
    },[type]);

    const months = useMemo(()=> {
        return listOfMonths.map((month,index) =>{
            return{
                value: index + 1,
                label: month,
            }
        });

    },[]);

    const years = useMemo(()=> {
        let uniqueYears: number[] = [];

        const {data} = pageData;

        data.forEach(item =>{
            const date = new Date(item.date);
            const year = date.getFullYear();

            if(!uniqueYears.includes(year)){
                uniqueYears.push(year)
            }
        });

        return uniqueYears.map(year => {
            return{
                value: year,
                label: year,
            }
        })

    },[data]);

    const handleFrequencyClick =(frequency: string) =>{
        const alreadySelected = frequencyFilterSelected.findIndex( item => item === frequency);

        if(alreadySelected >= 0){
            const filtered = frequencyFilterSelected.filter(item => item !== frequency);
            setFrequencyFilterSelected(filtered);
        }else{
            setFrequencyFilterSelected((prev) => [...prev, frequency]);
        }
    }

    const handleMonthSelected = (month: string) =>{
        try{
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        } 
        catch{
            throw new Error('invalid month value. Is accept o- 24.');

        }
    }

    const handleYearSelected = (year: string) =>{
        try{
            const parseYear = Number(year);
            setYearSelected(parseYear);
        } 
        catch{
            throw new Error('invalid year value. Is accept integer number.');

        }
    }
   
    useEffect(()=>{
        const {data} = pageData;
        const filteredData = data.filter(item =>{
            const date = new Date(item.date);
            const month = date.getMonth() +1;
            const year = date.getFullYear();

            return month === monthSelected && year === yearSelected && frequencyFilterSelected.includes(item.frequency);
        });

        const formattedData = filteredData.map(item=>{


            return{
                id: uuidv4(),
                description: item.description,
                amountFormatted: formatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormatted: formatDate (item.date),
                tagColor: item.frequency === 'recorrente' ? '#4e41f0' : '#e44c4e'
            }
        })
        setData(formattedData);
    },[pageData,monthSelected,yearSelected, data.length , frequencyFilterSelected])

    return(
        <Container>
            <ContentHeader
            title={pageData.title}
            lineColor={pageData.lineColor}
            >
                <SelectInput options={months} 
                onChange={(e)=> handleMonthSelected(e.target.value)} 
                defaultValue={monthSelected}/>
                <SelectInput options={years} 
                onChange={(e)=> handleYearSelected(e.target.value)} 
                defaultValue={yearSelected}/>
            </ContentHeader>

            <Filters>
                <button 
                    type="button"
                    className={`
                    tag-filter 
                    tag-filter-recurrent
                    ${frequencyFilterSelected.includes('recorrente') && 'tag-actived'}`}
                    onClick={()=> handleFrequencyClick('recorrente')}
                >
                    Recorrentes
                </button>
                <button 
                    type="button"
                    className={`
                    tag-filter 
                    tag-filter-eventual
                    ${frequencyFilterSelected.includes('eventual') && 'tag-actived'}`}
                    onClick={()=> handleFrequencyClick('eventual')}
                >
                    Eventuais
                </button>
            </Filters>

            <Content>
                { 
                 data.map(item=>(
                <HistoryFinanceCard 
                    key={item.id}
                    tagColor={item.tagColor}
                    title={item.description}
                    subtitle={item.dateFormatted}
                    amount={item.amountFormatted}
                />))
            }

            </Content>
        </Container>
    );
}

export default List;