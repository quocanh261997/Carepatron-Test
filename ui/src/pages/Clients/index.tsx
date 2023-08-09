import {memo, useContext, useEffect} from "react";
import {Paper, Typography} from "@mui/material";
import {StateContext} from "../../store/DataProvider";
import Page from "../../components/Page";
import ClientTable from "./ClientTable";
import {getClients} from "../../services/api";

function Clients() {
    const {state, dispatch} = useContext(StateContext);
    const {clients} = state;

    useEffect(() => {
        getClients({
            page: 1,
            pageSize: 5,
        }).then((res) => {
                console.log("res?.data?.clients", res.data)
                dispatch({type: "FETCH_ALL_CLIENTS", data: res?.data?.clients})
            }
        );
    }, [dispatch]);

    return (
        <Page>
            <Typography variant="h4" sx={{textAlign: "start"}}>
                Clients
            </Typography>
            <Paper sx={{margin: "auto", marginTop: 3}}>
                <ClientTable clients={clients}/>
            </Paper>
        </Page>
    );
}

export default memo(Clients);
