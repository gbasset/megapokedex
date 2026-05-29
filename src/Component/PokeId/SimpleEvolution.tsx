import { useState } from 'react'
import Image from '../UI/Image';
import styles from './PodeId.module.css';

type P = {
    datas?: any,
    officialArtWork?: any,
    id: string
}
function SimpleEvolution({ officialArtWork, datas, id }: P) {
    console.log('🚀🐱 😻 --///** ~ file: SimpleEvolution.tsx:9 ~ datas:', datas, id)

    const [needToNavigate, setneedToNavigate] = useState(false)

    function onInputValueChangeEventHandler() {
        setneedToNavigate(true)
    }
    if (needToNavigate) {
        const params = location;
        console.log('🚀🐱 😻 --///** ~ file: SimpleEvolution.tsx:22 ~ SimpleEvolution ~ params:', params)
        location.pathname = `poke/${id}`
    }

    return (

        <div className={'evolution'} onClick={() => onInputValueChangeEventHandler()}>

            <h2 onClick={() => onInputValueChangeEventHandler()} style={{ cursor: 'pointer' }}>
                <a>{datas?.friendlyName}</a></h2>

            {
                <Image onClick={() => onInputValueChangeEventHandler()}
                    className={styles.image_container_img_small}
                    placeholderImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
                    errorImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
                    src={officialArtWork && officialArtWork['front_default']}
                />
            }
        </div>
    )
}

export default SimpleEvolution