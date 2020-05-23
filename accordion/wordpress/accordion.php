<?php

// enqueue_component_styles('accordion');
// enqueue_component_scripts('Accordion');

$block_id = (array_key_exists('block_id', $data)) ? $data['block_id'] : false;
$title = (array_key_exists('title', $data)) ? $data['title'] : false;
$description = (array_key_exists('description', $data)) ? $data['description'] : '';
$accordion = (array_key_exists('accordion', $data)) ? $data['accordion'] : array();
$open_first_accordion = (array_key_exists('open_first_accordion', $data)) ? $data['open_first_accordion'] : false;
?>

<?php if(is_array($accordion) && count($accordion)) : ?>
  <div class="section" id="accordion">
      <header class="section__header">
        <?php echo ($title) ? '<h2 class="section-title">'.$title.'</h2>' : ''; ?>
        <?php echo ($description) ? $description : ''; ?>
      </header>
      <ul class="accordion" <?php echo ($open_first_accordion) ? 'data-open-first="true"' : '' ?>>
          <?php foreach($accordion as $key => $item) : ?>
            <li class="accordion__item">
                <h3 class="accordion__title">
                    <button
                    aria-expanded="false"
                    class="accordion__trigger"
                    aria-controls="accordion-<?php echo $block_id; ?>-content-<?php echo $key; ?>"
                    id="accordion-<?php echo $block_id; ?>-trigger-<?php echo $key; ?>"
                    >
                    <?php echo $item['item_title']?>
                    <span class="accordion__handle">
                      <svg viewBox="0 0 20 10"><path d="M0,0 10,10 20,0" /></svg>
                    </span>
                </h3>
                <div
                id="accordion-<?php echo $block_id; ?>-content-<?php echo $key; ?>"
                role="region"
                class="accordion__content"
                aria-labelledby="accordion-<?php echo $block_id; ?>-trigger-<?php echo $key; ?>"
                >
                  <?php echo $item['item_content']?>
                </div>
            </li>
          <?php endforeach; ?>
      </ul>
  </div>
<?php endif; ?>