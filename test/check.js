
functio  test(){
  const testArrOld = ['1,2,3'];
  const testArrNew = ['1,2,3'];

  alert(hasChangesBetween(testArrOld,testArrNew));
}

function hasChangesBetween(oldData, newData) {
    return oldData !== JSON.stringify(newData)
}
