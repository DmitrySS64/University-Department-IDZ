import {Discipline} from "@/shared/types/discipline";

type Props = {
    item: Discipline;
}

const DisciplineInfo = ({item:info}: Props) => {
    return(
        <div className="d-flex flex-column gap-2 w-100 p-2">
            <p>{info.Name}</p>
            <p>
                {info.Description}
            </p>
        </div>
    )
}
export default DisciplineInfo;