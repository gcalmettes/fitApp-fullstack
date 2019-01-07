import { 
  dataActions as dataAc
} from './actionTypes' 

export const processFile = ( { fileName, fileData } ) => ({
  type: dataAc.PROCESS_FILE,
  fileName,
  fileData
})