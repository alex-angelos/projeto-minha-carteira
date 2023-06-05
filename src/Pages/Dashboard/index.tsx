import React , {useState, useMemo, useCallback} from "react";
import { Container, Content } from "./styles";

import ContentHeader from "../../Components/ContentHeader";
import SelectInput from "../../Components/SelectInput";
import WalletBox from "../../Components/WalletBox";
import MessageBox from "../../Components/MessageBox";
import PieChartBox from "../../Components/PieChartBox";
import HistoryBox from "../../Components/HistoryBox";

import happyImg from "../../Assets/happy.svg";
import sadImg from "../../Assets/sad.svg";
import grinningImg from "../../Assets/grinning.svg"
import opsImg from "../../Assets/ops.svg"

import listOfMonths from "../../utils/months";
import expenses from "../../Repositories/expenses";
import gains from "../../Repositories/gains";
import BarChartBox from "../../Components/BarChartBox";


const Dashboard: React.FC = () => {
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());

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

        [...expenses,...gains].forEach(item =>{
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

    },[]);

    const totalExpenses = useMemo(()=>{
        let total: number = 0;

        expenses.forEach(item =>{
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth()+1;

            if (month === monthSelected && year === yearSelected){
              try{  total += Number(item.amount)
            } catch{
                throw new Error ("Invalid amount! Amount must be number.")
            }
            }
        });
        return total;

    },[monthSelected,yearSelected]);

    const totalGains = useMemo(()=>{
        let total: number = 0;

        gains.forEach(item =>{
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth()+1;

            if (month === monthSelected && year === yearSelected){
              try{  total += Number(item.amount)
            } catch{
                throw new Error ("Invalid amount! Amount must be number.")
            }
            }
        });
        return total;

    },[monthSelected,yearSelected]);

    const totalBalance = useMemo(()=>{
        return totalGains - totalExpenses;

    },[totalGains,totalExpenses]);

    const message = useMemo(()=>{
        if(totalBalance < 0){
            return{
                title:"Que triste!",
                description: "Nesse mês, você gastou mais do que deveria.",
                footerText: "Verifique seus gastos e tente cortar algumas coisas desenecessárias.",
                icon: sadImg
            }

        }

        else if(totalBalance === 0 && totalExpenses ===0){
            return{
                title:"Op's!",
                description: "Nesse mês, não há registro de entradas ou saídas.",
                footerText: "Parece que você não realizou nenhum registro no mês selecionado",
                icon: opsImg
            }
        }

        else if(totalBalance === 0) {
            return{
                title:"Ufaa!",
                description: "Nesse mês, você gastou exatamente o que ganhou.",
                footerText: "Tenha cuidado. No próximo mês tente poupar o seu dinheiro.",
                icon: grinningImg
            }
        }
       

         else{
                return {
                title:"Muito Bem!",
                description: "Sua carteira está positiva!",
                footerText: "Continue assim. Considere investir o seu saldo.",
                icon: happyImg
                }
            };

    },[totalBalance]);

    const relationExpansesVersusGains = useMemo(()=>{
        const total = totalGains + totalExpenses;

        const percentGains = Number(((totalGains / total) * 100).toFixed(1));
        const percentExpanses = Number(((totalExpenses / total ) *100).toFixed(1));

        const data = [
            {
                name: "Entradas",
                value: totalGains,
                percent: percentGains ? percentGains : 0,
                color: "#f7931b",
            },
            {
                name: "Saídas",
                value: totalExpenses,
                percent: percentExpanses ? percentExpanses : 0,
                color: "#e44c4e",
            }

        ];

        return data;

    },[totalGains,totalExpenses]);

    const historyData = useMemo(()=>{
        return listOfMonths.map((_,month)=>{
            let amountEntry =0;
            gains.forEach(gain=>{
                const date = new Date(gain.date);
                const gainMonth = date.getMonth();
                const gainYear = date.getFullYear();

                if(gainMonth === month && gainYear === yearSelected){
                    
                    try{
                    amountEntry += Number(gain.amount);
                }catch{
                    throw new Error('amountEntry is invalid. amountEntry must be valid number.')
                }

                }
            });

            let amountOutput =0;
            expenses.forEach(expense =>{
                const date = new Date(expense.date);
                const expenseMonth = date.getMonth();
                const expenseYear = date.getFullYear();

                if(expenseMonth === month && expenseYear === yearSelected){
                    
                    try{
                        amountOutput += Number(expense.amount);
                }catch{
                    throw new Error('amountOutput is invalid. amountOutput must be valid number.')
                }

                }
            });

            return {
                monthNumber: month,
                month: listOfMonths[month].substr(0, 3),
                amountEntry,
                amountOutput

            }
        })
        .filter(item =>{
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            return (yearSelected === currentYear && item.monthNumber <= currentMonth) || (yearSelected < currentYear)
        });
    },[yearSelected]);

    const relationExpensevesRecurrentVersusEventual = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;

        expenses
        .filter((expense) => {
            const date = new Date(expense.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            return month === monthSelected && year === yearSelected;
        })
        .forEach((expense) => {
            if(expense.frequency === 'recorrente'){
                return amountRecurrent += Number(expense.amount);
            }

            if(expense.frequency === 'eventual'){
                return amountEventual += Number(expense.amount);
            }
        });

        const total = amountRecurrent + amountEventual;

        const percentRecurrent = Number(((amountRecurrent / total) * 100).toFixed(1));
        const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));

        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: percentRecurrent ? percentRecurrent : 0, 
                color: "#F7931B"
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: percentEventual ? percentEventual : 0,
                color: "#E44C4E"
            }
        ];
    },[monthSelected, yearSelected]);

    


    const relationGainsRecurrentVersusEventual = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;

        gains
        .filter((gain) => {
            const date = new Date(gain.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            return month === monthSelected && year === yearSelected;
        })
        .forEach((gain) => {
            if(gain.frequency === 'recorrente'){
                return amountRecurrent += Number(gain.amount);
            }

            if(gain.frequency === 'eventual'){
                return amountEventual += Number(gain.amount);
            }
        });

        const total = amountRecurrent + amountEventual;

        const percentRecurrent = Number(((amountRecurrent / total) * 100).toFixed(1));
        const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));

        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: percentRecurrent ? percentRecurrent : 0,
                color: "#F7931B"
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: percentEventual ? percentEventual : 0,
                color: "#E44C4E"
            }
        ];
    },[monthSelected, yearSelected]);


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
    return(
        <Container>
            <ContentHeader title="Dashboard" lineColor="#f7931b">
            <SelectInput options={months} 
                onChange={(e)=> handleMonthSelected(e.target.value)} 
                defaultValue={monthSelected}/>
                <SelectInput options={years} 
                onChange={(e)=> handleYearSelected(e.target.value)} 
                defaultValue={yearSelected}/>
            </ContentHeader>
            <Content>
                <WalletBox 
                    color="#4e41f0"
                    title="saldo"
                    amount={totalBalance}
                    footerlabel="atualizado com base nas entradas e saídas"
                    icon="dollar"
                />
                <WalletBox 
                    color="#f7931b"
                    title="entradas"
                    amount={totalGains}
                    footerlabel="atualizado com base nas entradas e saídas"
                    icon="arrowUp"
                />
                <WalletBox 
                    color="#e44c4e"
                    title="saída"
                    amount={totalExpenses}
                    footerlabel="atualizado com base nas entradas e saídas"
                    icon="arrowDown"
                />

                <MessageBox 
                    title={message.title}
                    description={message.description}
                    footerText={message.footerText}
                    icon={message.icon}
                />

                <PieChartBox data={relationExpansesVersusGains}/>
                <HistoryBox
                data={historyData}
                lineColorAmountEntry= "#f7931b"
                lineColorAmountOutput= "#e44c4e"
                />

             <BarChartBox 
             title="Saídas"
             data={relationExpensevesRecurrentVersusEventual}
             />
             <BarChartBox 
             title="Entradas"
             data={relationGainsRecurrentVersusEventual}
             />     
            </Content>
        </Container>
    );
}

export default Dashboard;