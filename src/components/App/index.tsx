import './index.css';
import React, { useEffect, useRef, useState } from 'react';
import {
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  SimpleCell,
  CellButton,
  FormItem,
  Button,
  Textarea,
  Input,
  InfoRow,
  Spinner
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { usePlatform } from '@vkontakte/vkui/dist/hooks/usePlatform';
import getFact from 'services/getFact';
import getName from 'services/getName';
import { useDebounce } from 'hooks/useDebounce';

const App: React.FC = () => {

  interface IFact {
    fact: string
  }

  interface INameResult {
      name: string,
      age: number
  }


  const platform = usePlatform();

  const [activePanel, setActivePanel] = useState('name')
  const [fact, setFact] = useState <IFact> ()
  const [isLoading, setIsLoading] = useState(false)
  const [err, setError] = useState ('')

  const [nameValue, setNameValue] = useState('')
  const [nameResult, setNameResult] = useState <INameResult> ()

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const response = await getFact()
      setFact(response)
    }catch (error){
        if(typeof error === 'string') {
          setError(error)
        }
      console.log(error)
    }finally {
      setIsLoading(false)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setNameValue(value)
  }

  const debounchedSearchValue: string = useDebounce(nameValue, 3000)

  useEffect(() => {
    if(debounchedSearchValue) {
      getName(debounchedSearchValue).then(result => {
        setNameResult(result)
      })
    }else {
      setNameResult(undefined)
    }
  }, [debounchedSearchValue])

  return (
    <AppRoot>
      <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
        <SplitCol autoSpaced>
          <View activePanel={activePanel}>
            <Panel id="fact">
              {err && <h2>{err}</h2>}
              {isLoading && <Spinner />}
              <PanelHeader>fact</PanelHeader>
              <Group>
                <CellButton onClick={() => setActivePanel('name')}>go to name</CellButton>
                <form onSubmit={(e) => e.preventDefault()}>
                  <Button onClick={handleClick}>Click me</Button>
                  <FormItem htmlFor="fact" top="факт">
                    <Textarea value={fact?.fact} autoFocus/>
                  </FormItem>
                </form>
              </Group>
            </Panel>
            <Panel id="name">
              {err && <h2>{err}</h2>}
              {isLoading && <Spinner />}
              <PanelHeader>name</PanelHeader>
              <Group>
                <CellButton onClick={() => setActivePanel('fact')}>go to fact</CellButton>
                <form onSubmit={(e) => e.preventDefault()}>
                  <FormItem htmlFor="name" top="Имя">
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="Семён" 
                      value={nameValue} 
                      onChange={handleChange}
                      status={/^[a-zA-ZА-Яа-я]+$/.test(nameValue) ? "error" : "valid"}
                    />
                  </FormItem>
                  {nameResult && <Group header={<Header mode="secondary">Информация о пользователе</Header>}>
                    <SimpleCell multiline>
                      <InfoRow header="Имя">{nameResult?.name}</InfoRow>
                    </SimpleCell>
                    <SimpleCell>
                      <InfoRow header="Возраст">{nameResult?.age}</InfoRow>
                    </SimpleCell>
                  </Group>}
                </form>
              </Group>
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
};

export default App;

