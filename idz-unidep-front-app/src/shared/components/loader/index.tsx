import { ReactElement } from "react";
import { mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';
const Loader = (): ReactElement => (
    <div className='fixed w-full h-full bg-white z-[1000]'>
        <div className='h-screen flex items-center justify-center '>
            <div className="animate-spin">
                <Icon path={mdiLoading} size={3} color="#58A0A3"/>
            </div>
        </div>
    </div>
);


export default Loader;