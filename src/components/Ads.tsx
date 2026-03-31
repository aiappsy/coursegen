import { adsClient, adsSlot, displayADs } from '@/constants';
import { Adsense } from '@ctrl/react-adsense';
import AdPlaceholder from './AdPlaceholder';

const Ads = () => {
    return (
        <div className='mt-4'>
            {displayADs ?
                <>
                    {adsClient.length > 0 && adsSlot.length > 0 ?
                        <Adsense
                            client={adsClient}
                            slot={adsSlot}
                            style={{ display: 'block' }}
                            layout="in-article"
                            format="fluid"
                        /> :
                        <AdPlaceholder />}
                </>
                :
                <></>
            }
        </div>
    );
};

export default Ads;
