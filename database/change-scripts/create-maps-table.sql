-- Executed on test 2/1/2020
CREATE TABLE IF NOT EXISTS `map` (
  `mapID` INT NOT NULL,
  `mapName` TEXT NULL,
  `mapData` LONGTEXT NULL,
  `campaignID` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`mapID`),
  INDEX `fk_Maps_Campaign1_idx` (`campaignID` ASC),
  CONSTRAINT `fk_Maps_Campaign1`
    FOREIGN KEY (`campaignID`)
    REFERENCES `campaign` (`campaignID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
